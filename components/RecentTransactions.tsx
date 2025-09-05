import React, { useMemo } from 'react';
import type { Expense, Income, Account, Transaction } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface RecentTransactionsProps {
  expenses: Expense[];
  incomes: Income[];
  accounts: Account[];
  selectedAccountIds: string[];
  onViewAllClick: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: { id: string; type: 'expense' | 'income' }) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  expenses,
  incomes,
  accounts,
  selectedAccountIds,
  onViewAllClick,
  onEdit,
  onDelete,
}) => {
  const { t, formatCurrency, locale } = useTranslation();

  const getAccountName = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId)?.name || 'Unknown Account';
  };

  const recentTransactions = useMemo(() => {
    const filteredExpenses = expenses.filter(exp => selectedAccountIds.includes(exp.accountId));
    const filteredIncomes = incomes.filter(inc => selectedAccountIds.includes(inc.accountId));

    const combined: Transaction[] = [
      ...filteredExpenses.map(exp => ({ ...exp, type: 'expense' as const })),
      ...filteredIncomes.map(inc => ({ ...inc, type: 'income' as const })),
    ];

    return combined
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses, incomes, selectedAccountIds]);

  const TransactionIcon: React.FC<{ type: 'income' | 'expense' }> = ({ type }) => {
    if (type === 'income') {
      return (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      );
    }
    return (
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </div>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('recentTransactionsTitle')}</h2>
      
      {recentTransactions.length > 0 ? (
        <ul className="divide-y divide-slate-200 dark:divide-gray-700">
          {recentTransactions.map(trx => (
            <li key={trx.id} className="py-4 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                    <TransactionIcon type={trx.type} />
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-800 dark:text-white">{trx.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                           {new Date(trx.date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })} · {getAccountName(trx.accountId)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <p className={`font-bold ${trx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                        <button onClick={() => onEdit(trx)} className="p-1 text-sky-600 dark:text-sky-500 hover:text-sky-800 dark:hover:text-sky-400" aria-label={t('edit')}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button onClick={() => onDelete(trx)} className="p-1 text-rose-600 dark:text-rose-500 hover:text-rose-800 dark:hover:text-rose-400" aria-label={t('delete')}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">{t('noRecentTransactions')}</p>
        </div>
      )}

      {expenses.length > 0 || incomes.length > 0 ? (
        <div className="mt-6 text-center">
          <button
            onClick={onViewAllClick}
            className="w-full sm:w-auto px-6 py-2 bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t('viewAllTransactions')}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default RecentTransactions;
