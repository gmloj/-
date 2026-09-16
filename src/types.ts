export interface Commitment {
  id: string;
  title: string;
  amount: number;
  dueInDays: number;
  category: 'bill' | 'car' | 'subscription' | 'loan' | 'other';
  isEssential: boolean;
}

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  priority: 'high' | 'medium' | 'low';
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'food' | 'coffee' | 'transport' | 'shopping' | 'bills' | 'other';
  timestamp: string;
}

export interface UserState {
  ledgerDate?: string;
  expenseHistory?: (Expense & {date?: string})[];
  name: string;
  salary: number;
  currentBalance: number;
  daysToSalary: number;
  todaySpendingTarget: number;
  lifestyleNotes: string;
  commitments: Commitment[];
  wishlist: WishlistItem[];
  todayExpenses: Expense[];
}

export interface DecisionResult {
  decision: 'go' | 'wait' | 'alternative' | 'warning';
  decisionLabel: string;
  verdictTitle: string;
  summary: string;
  financialImpact: string;
  smartAlternative?: string;
  nextStep: string;
  tone: 'humorous' | 'firm' | 'encouraging';
}

export interface ImageAnalysisResult {
  type: 'bill' | 'product' | 'offer' | 'other';
  itemTitle: string;
  extractedAmount?: number;
  verdict: 'pay_now' | 'delay' | 'buy' | 'skip' | 'trap_alert' | 'good_deal';
  verdictTitle: string;
  verdictText: string;
  impactExplanation: string;
  smartAdvice: string;
}
