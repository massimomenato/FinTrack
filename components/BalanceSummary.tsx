import React from 'react';
import type { Expense, Income, Account } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface BalanceSummaryProps {
  expenses: Expense[];
  incomes: Income[];
  accounts: Account[];
  viewDate: Date;
  selectedAccountIds: string[];
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ expenses, incomes, accounts, viewDate, selectedAccountIds }) => {
  const { formatCurrency, t } = useTranslation();

  const selectedAccounts = accounts.filter(acc => selectedAccountIds.includes(acc.id));
  
  const initialBalance = selectedAccounts.reduce((sum, acc) => sum + acc.initialBalance, 0);

  const totalExpensesAllTime = expenses
    .filter(exp => selectedAccountIds.includes(exp.accountId))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalIncomesAllTime = incomes
    .filter(inc => selectedAccountIds.includes(inc.accountId))
    .reduce((sum, inc) => sum + inc.amount, 0);
    
  const currentBalance = initialBalance + totalIncomesAllTime - totalExpensesAllTime;
  
  const monthlyExpenses = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      return selectedAccountIds.includes(exp.accountId) &&
             expDate.getMonth() === viewDate.getMonth() &&
             expDate.getFullYear() === viewDate.getFullYear();
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyIncomes = incomes
    .filter(inc => {
      const incDate = new Date(inc.date);
      return selectedAccountIds.includes(inc.accountId) &&
             incDate.getMonth() === viewDate.getMonth() &&
             incDate.getFullYear() === viewDate.getFullYear();
    })
    .reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Current Balance */}
      <div className="p-6 text-center bg-white border rounded-2xl shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700 md:text-left">
        <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400 md:text-sm">{t('currentBalance')}</h3>
        <p className="mt-2 text-4xl font-bold text-slate-800 dark:text-white md:text-3xl">{formatCurrency(currentBalance)}</p>
      </div>

      {/* This wrapper lays out its children in 2 columns on mobile, and then disappears on desktop, promoting its children to the main grid */}
      <div className="grid grid-cols-2 gap-6 md:contents">
        {/* Monthly Income */}
        <div className="p-6 text-center bg-white border rounded-2xl shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700 md:text-left">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('monthlyIncome')}</h3>
          <p className="mt-2 text-2xl font-bold text-emerald-500 md:text-3xl">{formatCurrency(monthlyIncomes)}</p>
        </div>

        {/* Monthly Expenses */}
        <div className="p-6 text-center bg-white border rounded-2xl shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700 md:text-left">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('monthlyExpenses')}</h3>
          <p className="mt-2 text-2xl font-bold text-rose-500 md:text-3xl">{formatCurrency(monthlyExpenses)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;