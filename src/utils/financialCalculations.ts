import { UserState, Expense } from '../types';

export function calculateSafeDailyBudget(state: UserState): number {
  const upcomingEssentialBills = state.commitments
    .filter((c) => c.dueInDays <= state.daysToSalary && c.isEssential)
    .reduce((sum, c) => sum + c.amount, 0);

  const available = state.currentBalance - upcomingEssentialBills;
  if (state.daysToSalary <= 0) return Math.max(0, available);
  
  const daily = Math.floor(available / state.daysToSalary);
  return Math.max(0, daily);
}

export function formatSAR(amount: number): string {
  return `${amount.toLocaleString('ar-SA')} ر.س`;
}

export function getTodayTotalSpent(state: UserState): number {
  return state.todayExpenses.reduce((sum, e) => sum + e.amount, 0);
}

export function localDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function addExpense(state: UserState, expense: Expense): UserState {
  if (!Number.isFinite(expense.amount) || expense.amount <= 0) throw new Error('أدخل مبلغاً صحيحاً أكبر من صفر');
  if (state.todayExpenses.some(e => e.id === expense.id)) return state;
  const amount = Math.round(expense.amount * 100) / 100;
  return {...state, currentBalance: Math.round((state.currentBalance-amount)*100)/100, todayExpenses:[{...expense,amount},...state.todayExpenses]};
}
export function removeExpense(state: UserState, id: string): UserState {
  const expense = state.todayExpenses.find(e=>e.id===id);
  if (!expense) return state;
  return {...state,currentBalance:Math.round((state.currentBalance+expense.amount)*100)/100,todayExpenses:state.todayExpenses.filter(e=>e.id!==id)};
}
export function rollover(state: UserState, today = localDate()): UserState {
  if (!state.ledgerDate) return {...state,ledgerDate:today};
  const elapsed = Math.floor((Date.parse(today)-Date.parse(state.ledgerDate))/86400000);
  if (!Number.isFinite(elapsed) || elapsed <= 0) return state;
  const next = {...state,ledgerDate:today,daysToSalary:Math.max(0,state.daysToSalary-elapsed),
    commitments:state.commitments.map(c=>({...c,dueInDays:Math.max(0,c.dueInDays-elapsed)})),
    expenseHistory:[...(state.expenseHistory||[]),...state.todayExpenses.map(e=>({...e,date:state.ledgerDate}))],todayExpenses:[]};
  return {...next,todaySpendingTarget:calculateSafeDailyBudget(next)};
}
