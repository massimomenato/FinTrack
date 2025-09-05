import type { Account, AppState } from './types';

export const INITIAL_ACCOUNTS: Account[] = [];
export const INITIAL_EXPENSES: [] = [];

export const INITIAL_CATEGORIES: string[] = [];

export const INITIAL_APP_STATE: AppState = {
    accounts: INITIAL_ACCOUNTS,
    expenses: INITIAL_EXPENSES,
    incomes: [],
    categories: INITIAL_CATEGORIES,
    savingsGoal: { amount: 0 },
    categoryBudgets: {},
    lastModified: 0,
};