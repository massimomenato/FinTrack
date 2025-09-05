
import React from 'react';
import type { Expense, Income, Account, Transaction } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface TransactionListProps {
  transactions: {
    expenses: Expense[];
    incomes: Income[];
  };
  accounts: Account[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: { id: string, type: 'expense' | 'income' }) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions: { expenses, incomes }, accounts, onEdit, onDelete }) => {
  const { t, formatCurrency, locale } = useTranslation();

  const getAccountName = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId)?.name || 'Unknown Account';
  };
  
  const combinedTransactions: Transaction[] = [
    ...expenses.map(exp => ({ ...exp, type: 'expense' as const })),
    ...incomes.map(inc => ({ ...inc, type: 'income' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{t('allTransactions')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                    <th scope="col" className="px-6 py-3">{t('tableTitle')}</th>
                    <th scope="col" className="px-6 py-3">{t('tableAmount')}</th>
                    <th scope="col" className="px-6 py-3">{t('tableCategory')}</th>
                    <th scope="col" className="px-6 py-3">{t('tableDate')}</th>
                    <th scope="col" className="px-6 py-3">{t('tableAccount')}</th>
                    <th scope="col" className="px-6 py-3">{t('tableActions')}</th>
                </tr>
            </thead>
            <tbody>
                {combinedTransactions.map(trx => (
                    <tr key={trx.id} className="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">{trx.title}</td>
                        <td className={`px-6 py-4 font-semibold ${trx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                           {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                        </td>
                        <td className="px-6 py-4">
                           {trx.type === 'expense' ? trx.category : <span className="font-medium text-emerald-600 dark:text-emerald-400">{t('income')}</span>}
                        </td>
                        <td className="px-6 py-4">{new Date(trx.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className="px-6 py-4">{getAccountName(trx.accountId)}</td>
                        <td className="px-6 py-4 space-x-2">
                            <button type="button" onClick={() => onEdit(trx)} className="font-medium text-sky-600 dark:text-sky-500 hover:underline">{t('edit')}</button>
                            <button type="button" onClick={() => onDelete(trx)} className="font-medium text-rose-600 dark:text-rose-500 hover:underline">{t('delete')}</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      {combinedTransactions.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-4">{t('noTransactionsRecorded')}</p>
      )}
    </div>
  );
};

export default TransactionList;