export type Page =
  | "home"
  | "about"
  | "bookkeeping"
  | "business-performance"
  | "operations-advisory"
  | "contact";

export interface DemoState {
  revenue: number;
  expenses: number;
  laborPct: number;
}

export interface ContactState {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  helpWith: string;
  message: string;
}
