import React, { useState, useMemo, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

import type { AppState, Account, Expense, Income, ExpenseFormData, IncomeFormData, Transaction, SavingsGoal, CategoryBudgets } from './types';
import { INITIAL_APP_STATE } from './constants';

import BalanceSummary from './components/BalanceSummary';
import GoalsAndBudgets from './components/GoalsAndBudgets';
import TransactionsView from './components/TransactionsView';
import Settings from './components/Settings';
import ExpenseForm from './components/ExpenseForm';
import IncomeForm from './components/IncomeForm';
import Modal from './components/Modal';
import ConfirmationModal from './components/ConfirmationModal';
import DateNavigator from './components/DateNavigator';
import MultiSelectDropdown from './components/MultiSelectDropdown';
// import LanguageToggle from './components/LanguageToggle';
// import ThemeToggle from './components/ThemeToggle';
import RecentTransactions from './components/RecentTransactions';

import { useTranslation } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

type View = 'dashboard' | 'transactions' | 'settings';
type ModalType = 
    | { type: 'expense'; expense?: Expense }
    | { type: 'income'; income?: Income }
    | { type: 'delete-transaction'; transaction: { id: string, type: 'expense' | 'income' }}
    | null;


function App() {
  const [state, setState] = useLocalStorage<AppState>('appState', INITIAL_APP_STATE);
  const { accounts, expenses, incomes, categories, savingsGoal, categoryBudgets } = state;

  const [view, setView] = useState<View>('dashboard');
  const [modal, setModal] = useState<ModalType>(null);
  const [viewDate, setViewDate] = useState(new Date());
  
  const { t, currency, setCurrency } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(() => accounts.map(a => a.id));

  // Update selected accounts if accounts list changes
  useEffect(() => {
    setSelectedAccountIds(prev => {
        const existingAccountIds = new Set(accounts.map(a => a.id));
        const newSelection = prev.filter(id => existingAccountIds.has(id));
        // If selection is empty after filtering, select all accounts.
        if (newSelection.length === 0 && accounts.length > 0) {
            return accounts.map(a => a.id);
        }
        return newSelection;
    });
  }, [accounts]);
  
  const updateState = useCallback((updater: (prevState: AppState) => AppState) => {
    setState(prev => ({ ...updater(prev), lastModified: Date.now() }));
  }, [setState]);

  // Handlers for state changes
  const handleAddAccount = (accountData: Omit<Account, 'id'>) => {
    updateState(prev => ({ ...prev, accounts: [...prev.accounts, { ...accountData, id: uuidv4() }] }));
  };

  const handleDeleteAccount = (id: string) => {
    updateState(prev => ({
        ...prev,
        accounts: prev.accounts.filter(acc => acc.id !== id),
        expenses: prev.expenses.filter(exp => exp.accountId !== id),
        incomes: prev.incomes.filter(inc => inc.accountId !== id),
    }));
  };
  
  const handleAddExpense = (expenseData: ExpenseFormData) => {
    updateState(prev => ({ ...prev, expenses: [...prev.expenses, { ...expenseData, id: uuidv4() }] }));
    setModal(null);
  };
  
  const handleUpdateExpense = (expenseData: Expense) => {
     updateState(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === expenseData.id ? expenseData : e) }));
     setModal(null);
  }

  const handleDeleteTransaction = ({ id, type }: { id: string, type: 'expense' | 'income' }) => {
    if (type === 'expense') {
        updateState(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
    } else {
        updateState(prev => ({ ...prev, incomes: prev.incomes.filter(i => i.id !== id) }));
    }
    setModal(null);
  };
  
  const handleAddIncome = (incomeData: IncomeFormData) => {
    updateState(prev => ({ ...prev, incomes: [...prev.incomes, { ...incomeData, id: uuidv4() }] }));
    setModal(null);
  };
  
  const handleUpdateIncome = (incomeData: Income) => {
     updateState(prev => ({ ...prev, incomes: prev.incomes.map(i => i.id === incomeData.id ? incomeData : i) }));
     setModal(null);
  }
  
  const handleAddCategory = (name: string) => {
    if (name && !categories.includes(name)) {
        updateState(prev => ({...prev, categories: [...prev.categories, name].sort() }));
    }
  }

  const handleDeleteCategory = (name: string) => {
    updateState(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== name),
        // Note: Expenses with this category are not re-categorized automatically.
    }));
  }

  const handleSetSavingsGoal = (goal: SavingsGoal) => {
      updateState(prev => ({...prev, savingsGoal: goal }));
  }

  const handleSetCategoryBudgets = (budgets: CategoryBudgets) => {
      updateState(prev => ({...prev, categoryBudgets: budgets }));
  }

  // Derived state for views
  const filteredExpenses = useMemo(() => expenses.filter(exp => selectedAccountIds.includes(exp.accountId)), [expenses, selectedAccountIds]);
  const filteredIncomes = useMemo(() => incomes.filter(inc => selectedAccountIds.includes(inc.accountId)), [incomes, selectedAccountIds]);
  
  const accountOptions = useMemo(() => accounts.map(acc => ({ label: acc.name, value: acc.id })), [accounts]);
  
  const handleEditTransaction = (trx: Transaction) => {
    if (trx.type === 'expense') setModal({ type: 'expense', expense: trx });
    else setModal({ type: 'income', income: trx });
  }

  return (
    <div className="bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200 min-h-screen font-sans">
      <header className="bg-white dark:bg-slate-900/70 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2">
                    <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div className="md:hidden">
                      {view !== 'settings' && accounts.length > 0 && (
                        <MultiSelectDropdown
                          options={accountOptions}
                          selectedValues={selectedAccountIds}
                          onChange={setSelectedAccountIds}
                          placeholder={t('selectAccounts')}
                          isIconOnly={true}
                          buttonClassName="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 relative"
                        />
                      )}
                    </div>
                     <nav className="hidden md:flex items-center space-x-1">
                        <button onClick={() => setView('dashboard')} className={`px-3 py-2 text-sm font-medium rounded-md ${view === 'dashboard' ? 'bg-slate-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-gray-800'}`}>{t('dashboard')}</button>
                        <button onClick={() => setView('transactions')} className={`px-3 py-2 text-sm font-medium rounded-md ${view === 'transactions' ? 'bg-slate-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-gray-800'}`}>{t('transactions')}</button>
                        <button onClick={() => setView('settings')} className={`px-3 py-2 text-sm font-medium rounded-md ${view === 'settings' ? 'bg-slate-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-gray-800'}`}>{t('settings')}</button>
                    </nav>
                </div>
                 
                <div className="flex items-center space-x-4">
                 {view !== 'settings' && accounts.length > 0 && (
                    <DateNavigator viewDate={viewDate} setViewDate={setViewDate} expenses={expenses} incomes={incomes} />
                 )}
                </div>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {accounts.length === 0 && view !== 'settings' ? (
            <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-2">{t('welcome')}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{t('getStarted')}</p>
                <button onClick={() => setView('settings')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">{t('addFirstAccount')}</button>
            </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="hidden md:block">
                  {view !== 'settings' && accounts.length > 0 && <MultiSelectDropdown options={accountOptions} selectedValues={selectedAccountIds} onChange={setSelectedAccountIds} placeholder={t('selectAccounts')} />}
                </div>
                <div className="flex-grow"></div>
                <div className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-4">
                  {view !== 'settings' && accounts.length > 0 && (
                    <>
                      <button onClick={() => setModal({type: 'income'})} className="flex-1 sm:flex-none px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold text-base transition-colors shadow-md hover:shadow-lg">{t('addIncome')}</button>
                      <button onClick={() => setModal({type: 'expense'})} className="flex-1 sm:flex-none px-6 py-4 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-semibold text-base transition-colors shadow-md hover:shadow-lg">{t('addExpense')}</button>
                    </>
                  )}
                </div>
            </div>
            
            {view === 'dashboard' && (
              <div className="space-y-8">
                <BalanceSummary expenses={filteredExpenses} incomes={filteredIncomes} accounts={accounts} viewDate={viewDate} selectedAccountIds={selectedAccountIds} />
                <GoalsAndBudgets expenses={filteredExpenses} incomes={filteredIncomes} savingsGoal={savingsGoal} categoryBudgets={categoryBudgets} viewDate={viewDate} />
                <RecentTransactions
                  expenses={expenses}
                  incomes={incomes}
                  accounts={accounts}
                  selectedAccountIds={selectedAccountIds}
                  onViewAllClick={() => setView('transactions')}
                  onEdit={handleEditTransaction}
                  onDelete={(trx) => setModal({ type: 'delete-transaction', transaction: trx })}
                />
              </div>
            )}
            {view === 'transactions' && (
              <TransactionsView expenses={expenses} incomes={incomes} accounts={accounts} onEdit={handleEditTransaction} onDelete={(trx) => setModal({ type: 'delete-transaction', transaction: trx })} selectedAccountIds={selectedAccountIds} viewDate={viewDate} />
            )}
            {view === 'settings' && (
              <Settings 
                accounts={accounts} 
                categories={categories} 
                savingsGoal={savingsGoal}
                categoryBudgets={categoryBudgets}
                onAccountAdd={handleAddAccount} 
                onAccountDelete={handleDeleteAccount}
                onCategoryAdd={handleAddCategory}
                onCategoryDelete={handleDeleteCategory}
                onSavingsGoalSet={handleSetSavingsGoal}
                onCategoryBudgetsSet={handleSetCategoryBudgets}
                currency={currency}
                setCurrency={setCurrency}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={modal?.type === 'expense' || modal?.type === 'income'}
        onClose={() => setModal(null)}
        // FIX: Fix TypeScript error by correctly narrowing the modal type before accessing type-specific properties.
        title={modal?.type === 'expense' ? (modal.expense ? t('editExpense') : t('addExpense')) : (modal?.type === 'income' ? (modal.income ? t('editIncome') : t('addIncome')) : '')}
      >
        {modal?.type === 'expense' && (
          <ExpenseForm
            onSubmit={modal.expense ? (data) => handleUpdateExpense({ ...data, id: modal.expense!.id }) : handleAddExpense}
            onClose={() => setModal(null)}
            accounts={accounts}
            expenseToEdit={modal.expense}
            categories={categories}
          />
        )}
        {modal?.type === 'income' && (
          <IncomeForm
            onSubmit={modal.income ? (data) => handleUpdateIncome({ ...data, id: modal.income!.id }) : handleAddIncome}
            onClose={() => setModal(null)}
            accounts={accounts}
            incomeToEdit={modal.income}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={modal?.type === 'delete-transaction'}
        onClose={() => setModal(null)}
        onConfirm={() => modal?.type === 'delete-transaction' && handleDeleteTransaction(modal.transaction)}
        title={t('deleteTransactionTitle')}
        message={t('deleteTransactionMessage')}
      />

      {/* Bottom Navigation for Mobile */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 z-40">
        <nav className="flex justify-around items-center h-16">
          <button 
            onClick={() => setView('dashboard')} 
            className={`flex flex-col items-center justify-center w-full transition-colors ${view === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs font-medium">{t('dashboard')}</span>
          </button>
          <button 
            onClick={() => setView('transactions')} 
            className={`flex flex-col items-center justify-center w-full transition-colors ${view === 'transactions' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-xs font-medium">{t('transactions')}</span>
          </button>
          <button 
            onClick={() => setView('settings')} 
            className={`flex flex-col items-center justify-center w-full transition-colors ${view === 'settings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">{t('settings')}</span>
          </button>
        </nav>
      </footer>
    </div>
  );
}

export default App;