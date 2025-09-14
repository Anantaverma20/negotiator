export type Role = 'user' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export type Intake = {
  salary?: number;
  assets?: number;
  firstTimeBuyer?: boolean;
  cars?: number;
  consentBG?: boolean;
  consentCredit?: boolean;
};

export type Checks = {
  backgroundPassed?: boolean;
  creditScore?: number; // mock 742
};

export type RateContext = {
  baselineAPR?: number; // e.g., 6.8
  offeredAPR?: number;  // evolves via negotiation
  floorAPR?: number;    // e.g., 6.45
  stepDown?: number;    // e.g., 0.03
  accepted?: boolean;
  notaryDone?: boolean;
};

export interface SessionState {
  intake: Intake;
  checks: Checks;
  rate: RateContext;
  history: ChatMessage[];
  phase:
    | 'intake'
    | 'awaiting_consent_bg'
    | 'bg_done'
    | 'awaiting_consent_credit'
    | 'credit_done'
    | 'rate_ready'
    | 'negotiating'
    | 'notary'
    | 'final';
}
