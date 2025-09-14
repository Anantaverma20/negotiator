import { v4 as uuidv4 } from 'uuid';
import { SessionState, ChatMessage } from './types';

// Module-level Map for in-memory state
const sessions = new Map<string, SessionState>();

export function getOrCreateSession(sessionId: string): SessionState {
  if (!sessions.has(sessionId)) {
    const newSession: SessionState = {
      intake: {},
      checks: {},
      rate: {},
      history: [],
      phase: 'intake',
    };
    sessions.set(sessionId, newSession);
  }
  return sessions.get(sessionId)!;
}

export function appendMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const session = getOrCreateSession(sessionId);
  const fullMessage: ChatMessage = {
    id: uuidv4(),
    timestamp: Date.now(),
    ...message,
  };
  session.history.push(fullMessage);
  return fullMessage;
}

export function updateSession(sessionId: string, patch: Partial<SessionState>): SessionState {
  const session = getOrCreateSession(sessionId);
  Object.assign(session, patch);
  sessions.set(sessionId, session);
  return session;
}
