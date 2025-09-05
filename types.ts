
export enum Recurrence {
  NONE = 'None',
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Bi-weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export type ExpenseCategory = string;

export interface Account {
  id: string;
  name: string;
  initialBalance: number;
}

export interface Expense {
  id:string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO 8601 format: YYYY-MM-DD
  accountId: string;
  recurrence: Recurrence;
}

export interface Income {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO 8601 format: YYYY-MM-DD
  accountId: string;
}

export type Transaction = (Expense & { type: 'expense' }) | (Income & { type: 'income' });

export type ExpenseFormData = Omit<Expense, 'id'>;
export type IncomeFormData = Omit<Income, 'id'>;

export type CategoryBudgets = {
    [key: ExpenseCategory]: number | undefined;
};

export interface SavingsGoal {
    amount: number;
}

export interface AppState {
  accounts: Account[];
  expenses: Expense[];
  incomes: Income[];
  categories: string[];
  savingsGoal: SavingsGoal;
  categoryBudgets: CategoryBudgets;
  lastModified: number; // UTC timestamp
}

export type SyncPayload =
  | { type: 'full-sync'; payload: AppState }
  | { type: 'ACCOUNT_ADD'; payload: Account }
  | { type: 'ACCOUNT_DELETE'; payload: { id: string } }
  | { type: 'EXPENSE_ADD'; payload: Expense }
  | { type: 'EXPENSE_UPDATE'; payload: Expense }
  | { type: 'EXPENSE_DELETE'; payload: { id: string } }
  | { type: 'INCOME_ADD'; payload: Income }
  | { type: 'INCOME_UPDATE'; payload: Income }
  | { type: 'INCOME_DELETE'; payload: { id: string } }
  | { type: 'CATEGORY_ADD'; payload: string }
  | { type: 'CATEGORY_DELETE'; payload: { name: string } }
  | { type: 'SAVINGS_GOAL_SET'; payload: SavingsGoal }
  | { type: 'CATEGORY_BUDGETS_SET'; payload: CategoryBudgets };