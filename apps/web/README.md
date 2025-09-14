# Mortgage Rate Negotiator

A Next.js 14 hackathon demo with a chat UI for mortgage rate negotiation.

## Features

- **Chat Interface**: Interactive chat UI for mortgage application process
- **Intake Questions**: Collects salary, assets, first-time buyer status, and number of cars
- **Background & Credit Checks**: Mock consent flow and checks
- **Rate Calculation**: Baseline rate from "FRED" mock + adjustments
- **Negotiation Loop**: Lender agent + loyalty agent counter-offers until floor APR
- **Notary Process**: Final step with LLM report stub

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- In-memory state management

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### POST /api/agent

Advances the conversation state based on user input.

**Request Body:**
```json
{
  "sessionId": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "reply": "string",
  "state": "SessionState"
}
```

## Conversation Flow

1. **Intake**: Collect salary, assets, first-time buyer status, cars
2. **Background Consent**: Request consent for background check
3. **Credit Consent**: Request consent for credit check
4. **Rate Offer**: Present initial mortgage rate
5. **Negotiation**: Counter-offer loop until floor APR (6.45%)
6. **Acceptance**: Finalize with notary process
7. **Completion**: Generate final report

## Key Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## File Structure

```
apps/web/
├── app/
│   ├── api/agent/route.ts    # Main API endpoint
│   ├── globals.css           # Tailwind styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Chat UI
├── lib/
│   ├── types.ts             # TypeScript types
│   ├── state.ts             # In-memory state management
│   ├── negotiation.ts       # Negotiation logic
│   ├── rate.ts              # Rate calculation
│   └── prompts.ts           # Response strings
├── providers/
│   └── index.ts             # Future Convex/Inkeep stubs
└── Configuration files...
```

## State Management

Uses in-memory Map keyed by sessionId. No database required for demo.

## Rate Logic

- **Baseline APR**: 6.8% (mock FRED rate)
- **Initial Offer**: 6.62%
- **Floor APR**: 6.45%
- **Step Down**: 0.03% per negotiation
- **Adjustments**: -0.03% for assets >$100k, -0.02% for first-time buyers

## Exact Response Strings

The system uses specific response strings for consistent UX:

- Background check: "Background check passed (mock). Next: credit check?"
- Credit check: "Soft credit check passed (mock score 742). Calculating rate..."
- Rate offer: "Baseline 30yr: 6.8%. Offered APR: X.XX%. Proceed to negotiation?"
- Negotiation: "New offer: X.XX% APR with loyalty discount."
- Acceptance: "Finalizing with Notary Agent. Sending final report..."
- Completion: "Notary complete (mock). Final report generated (stub)."
