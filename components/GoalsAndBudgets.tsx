import React from 'react';
import type { Expense, Income, SavingsGoal, CategoryBudgets, ExpenseCategory } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface GoalsAndBudgetsProps {
  expenses: Expense[];
  incomes: Income[];
  savingsGoal: SavingsGoal;
  categoryBudgets: CategoryBudgets;
  viewDate: Date;
}

const ProgressBar: React.FC<{ value: number; max: number; colorClass: string }> = ({ value, max, colorClass }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(Math.abs(percentage), 100)}%` }}
      ></div>
    </div>
  );
};

const GoalsAndBudgets: React.FC<GoalsAndBudgetsProps> = ({ expenses, incomes, savingsGoal, categoryBudgets, viewDate }) => {
  const { t, formatCurrency } = useTranslation();
  
  const selectedMonth = viewDate.getMonth();
  const selectedYear = viewDate.getFullYear();

  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === selectedMonth && expDate.getFullYear() === selectedYear;
  });
  
  const monthlyIncomes = incomes.filter(inc => {
    const incDate = new Date(inc.date);
    return incDate.getMonth() === selectedMonth && incDate.getFullYear() === selectedYear;
  });

  const totalMonthlyIncome = monthlyIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savedThisMonth = totalMonthlyIncome - totalMonthlyExpenses;

  const categorySpending = Object.keys(categoryBudgets)
    .map(cat => {
        const category = cat as ExpenseCategory;
        const budget = categoryBudgets[category];
        if (!budget || budget <= 0) return null;

        const spent = monthlyExpenses
            .filter(exp => exp.category === category)
            .reduce((sum, exp) => sum + exp.amount, 0);

        return { category, budget, spent };
    })
    .filter((item): item is { category: string; budget: number; spent: number } => item !== null);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('goalsAndBudgetsTitle')}</h2>
      
      {savingsGoal && savingsGoal.amount > 0 && (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('savingsGoal')}</h3>
            <div className="flex justify-between items-center mb-1 text-sm text-slate-600 dark:text-slate-400">
                <span>{t('savedThisMonth')}</span>
                <span className="font-medium">{formatCurrency(savedThisMonth)} / {formatCurrency(savingsGoal.amount)}</span>
            </div>
            <ProgressBar value={savedThisMonth} max={savingsGoal.amount} colorClass={savedThisMonth < 0 ? 'bg-red-500' : 'bg-indigo-500'}/>
        </div>
      )}

      {categorySpending.length > 0 && (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('categoryBudgetsTitle')}</h3>
            <div className="space-y-4">
                {categorySpending.map(item => (
                    <div key={item.category}>
                        <div className="flex justify-between items-center mb-1 text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium">{item.category}</span>
                            <span>{formatCurrency(item.spent)} / {formatCurrency(item.budget)}</span>
                        </div>
                        <ProgressBar value={item.spent} max={item.budget} colorClass={item.spent > item.budget ? 'bg-red-500' : 'bg-emerald-500'}/>
                    </div>
                ))}
            </div>
        </div>
      )}
      
      {(!savingsGoal || savingsGoal.amount <= 0) && categorySpending.length === 0 && (
        <div className="text-center p-4 border-2 border-dashed rounded-lg dark:border-gray-700">
            <p className="text-slate-500 dark:text-slate-400">{t('noGoalsSet')}</p>
        </div>
      )}

    </div>
  );
};

export default GoalsAndBudgets;