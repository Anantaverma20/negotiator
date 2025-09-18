import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSession, appendMessage, updateSession } from '@/lib/state';
import { computeInitialRate } from '@/lib/rate';
import { counterOffer, isAtFloor } from '@/lib/negotiation';
import { STR } from '@/lib/prompts';
import { parseFirstTimeBuyer } from '@/lib/intake';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Missing sessionId or message' }, { status: 400 });
    }

    // Get session and append user message
    const session = getOrCreateSession(sessionId);
    appendMessage(sessionId, { role: 'user', content: message });

    const lowerMessage = message.toLowerCase();
    let reply = '';

    // FSM logic based on phase and keywords
    if (session.phase === 'intake') {
      // Parse intake fields
      const intake = { ...session.intake };
      let fieldsUpdated = false;
      
      // Extract salary - more flexible patterns
      const salaryMatch = message.match(/salary[:\s]*(?:is\s*)?[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) || 
                         message.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)[:\s]*salary/i) ||
                         message.match(/make[:\s]*[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                         message.match(/earn[:\s]*[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
      if (salaryMatch) {
        intake.salary = parseInt(salaryMatch[1].replace(/,/g, ''));
        fieldsUpdated = true;
      }
      
      // Extract assets - look for house value, savings, etc.
      const assetsMatch = message.match(/assets[:\s]*[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                         message.match(/house[:\s]*(?:worth|value)?[:\s]*[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                         message.match(/savings[:\s]*[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                         message.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)[:\s]*(?:in\s*)?assets/i);
      if (assetsMatch) {
        intake.assets = parseInt(assetsMatch[1].replace(/,/g, ''));
        fieldsUpdated = true;
      } else if (lowerMessage.includes('house') && lowerMessage.includes('no')) {
        intake.assets = 0;
        fieldsUpdated = true;
      }

      // Extract first-time buyer - more flexible patterns
      const firstTimeBuyer = parseFirstTimeBuyer(message);
      if (firstTimeBuyer !== undefined) {
        intake.firstTimeBuyer = firstTimeBuyer;
        fieldsUpdated = true;
      }
      
      // Extract cars - more flexible patterns
      const carsMatch = message.match(/cars?[:\s]*(\d+)/i) ||
                       message.match(/(\d+)[:\s]*cars?/i) ||
                       message.match(/have[:\s]*(\d+)[:\s]*cars?/i);
      if (carsMatch) {
        intake.cars = parseInt(carsMatch[1]);
        fieldsUpdated = true;
      } else if (lowerMessage.includes('no cars') || (lowerMessage.includes('cars') && lowerMessage.includes('no'))) {
        intake.cars = 0;
        fieldsUpdated = true;
      }

      // Update intake if any fields were parsed
      if (fieldsUpdated) {
        updateSession(sessionId, { intake });
      }

      // Check if we have enough info to proceed
      if (intake.salary && intake.assets !== undefined && intake.firstTimeBuyer !== undefined && intake.cars !== undefined) {
        updateSession(sessionId, { phase: 'awaiting_consent_bg' });
        reply = 'Thank you for the information. We need your consent for background and credit checks. Do you consent to a background check?';
      } else {
        // Ask for missing information specifically
        const missing = [];
        if (!intake.salary) missing.push('salary');
        if (intake.assets === undefined) missing.push('assets/house value');
        if (intake.firstTimeBuyer === undefined) missing.push('first-time buyer status');
        if (intake.cars === undefined) missing.push('number of cars');
        
        if (missing.length > 0) {
          reply = `I still need some information. Please provide your: ${missing.join(', ')}. For example: "My salary is $75,000, I have $50,000 in assets, I am a first-time buyer, and I have 1 car."`;
        } else {
          reply = STR.HELLO;
        }
      }
    } else if (session.phase === 'awaiting_consent_bg' && 
               (lowerMessage.includes('consent') || 
                lowerMessage.includes('yes') || 
                lowerMessage.includes('agree') || 
                lowerMessage.includes('ok') || 
                lowerMessage.includes('sure') ||
                lowerMessage.includes('accept'))) {
      updateSession(sessionId, { 
        checks: { ...session.checks, backgroundPassed: true },
        phase: 'bg_done'
      });
      reply = STR.CONSENT_BG_NEXT;
    } else if (session.phase === 'bg_done' && 
               (lowerMessage.includes('credit') || 
                lowerMessage.includes('yes') || 
                lowerMessage.includes('agree') || 
                lowerMessage.includes('ok') || 
                lowerMessage.includes('sure') ||
                lowerMessage.includes('accept'))) {
      const rate = computeInitialRate(session.intake);
      updateSession(sessionId, { 
        checks: { ...session.checks, creditScore: 742 },
        rate,
        phase: 'credit_done'
      });
      reply = STR.CONSENT_CREDIT_READY;
      
      // Automatically move to rate_ready phase
      updateSession(sessionId, { phase: 'rate_ready' });
    } else if (lowerMessage.includes('rate') && session.phase === 'rate_ready') {
      const currentRate = session.rate.offeredAPR || 6.62;
      reply = `${STR.RATE_OFFER_PREFIX}${currentRate}${STR.RATE_OFFER_SUFFIX}`;
    } else if (lowerMessage.includes('negotiate') && (session.phase === 'rate_ready' || session.phase === 'negotiating')) {
      const newRate = counterOffer(session.rate);
      updateSession(sessionId, { rate: newRate, phase: 'negotiating' });
      reply = `${STR.NEGOTIATE_STEP}${newRate.offeredAPR}${STR.NEGOTIATE_SUFFIX}`;
    } else if (lowerMessage.includes('accept') && (session.phase === 'negotiating' || session.phase === 'rate_ready')) {
      const acceptedRate = { ...session.rate, accepted: true };
      updateSession(sessionId, { 
        rate: acceptedRate, 
        phase: 'notary' 
      });
      reply = STR.ACCEPT_FINAL;
      
      // Add agent message for reply
      appendMessage(sessionId, { role: 'agent', content: reply });
      
      // Then add notary completion
      const finalRate = { ...acceptedRate, notaryDone: true };
      updateSession(sessionId, { 
        rate: finalRate, 
        phase: 'final' 
      });
      appendMessage(sessionId, { role: 'agent', content: STR.NOTARY_DONE });
      
      // Return both messages
      const updatedSession = getOrCreateSession(sessionId);
      return NextResponse.json({ 
        reply: reply,
        state: updatedSession 
      });
    } else {
      // Default helpful response based on current phase
      switch (session.phase) {
        case 'intake':
          reply = STR.HELLO;
          break;
        case 'awaiting_consent_bg':
          reply = 'Do you consent to a background check?';
          break;
        case 'bg_done':
          reply = 'Do you consent to a credit check?';
          break;
        case 'credit_done':
        case 'rate_ready':
          reply = 'Would you like to see your rate offer?';
          break;
        case 'negotiating':
          reply = 'Would you like to negotiate further or accept the current offer?';
          break;
        default:
          reply = 'How can I help you with your mortgage application?';
      }
    }

    // Add agent reply to history
    appendMessage(sessionId, { role: 'agent', content: reply });
    
    const updatedSession = getOrCreateSession(sessionId);
    return NextResponse.json({ 
      reply,
      state: updatedSession 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
