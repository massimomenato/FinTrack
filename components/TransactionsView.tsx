import React, { useMemo } from 'react';
import type { Expense, Income, Account, Transaction } from '../types';
import AnalysisChart from './ExpenseChart';
import TransactionList from './TransactionList';

interface TransactionsViewProps {
  expenses: Expense[];
  incomes: Income[];
  accounts: Account[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: { id: string; type: 'expense' | 'income' }) => void;
  selectedAccountIds: string[];
  viewDate: Date;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({
  expenses,
  incomes,
  accounts,
  onEdit,
  onDelete,
  selectedAccountIds,
  viewDate,
}) => {

  const filteredTransactions = useMemo(() => {
    const selectedMonth = viewDate.getMonth();
    const selectedYear = viewDate.getFullYear();

    const filteredExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return selectedAccountIds.includes(exp.accountId) &&
             expDate.getMonth() === selectedMonth &&
             expDate.getFullYear() === selectedYear;
    });

    const filteredIncomes = incomes.filter(inc => {
      const incDate = new Date(inc.date);
      return selectedAccountIds.includes(inc.accountId) &&
             incDate.getMonth() === selectedMonth &&
             incDate.getFullYear() === selectedYear;
    });
    
    return { expenses: filteredExpenses, incomes: filteredIncomes };
  }, [expenses, incomes, selectedAccountIds, viewDate]);

  return (
    <div className="space-y-8">
      <AnalysisChart 
        expenses={expenses}
        incomes={incomes}
        selectedAccountIds={selectedAccountIds} 
        viewDate={viewDate} 
      />
      <TransactionList
        transactions={filteredTransactions}
        accounts={accounts}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default TransactionsView;