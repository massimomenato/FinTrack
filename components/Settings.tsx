
import React, { useState } from 'react';
import type { Account, SavingsGoal, CategoryBudgets, ExpenseCategory } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import ConfirmationModal from './ConfirmationModal';
import LanguageToggle from './LanguageToggle';

interface SettingsProps {
  accounts: Account[];
  categories: string[];
  savingsGoal: SavingsGoal;
  categoryBudgets: CategoryBudgets;
  onAccountAdd: (account: Omit<Account, 'id'>) => void;
  onAccountDelete: (id: string) => void;
  onCategoryAdd: (name: string) => void;
  onCategoryDelete: (name: string) => void;
  onSavingsGoalSet: (goal: SavingsGoal) => void;
  onCategoryBudgetsSet: (budgets: CategoryBudgets) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

type SettingsTab = 'management' | 'appearance';

const Settings: React.FC<SettingsProps> = ({
  accounts, categories, savingsGoal, categoryBudgets,
  onAccountAdd, onAccountDelete, onCategoryAdd, onCategoryDelete,
  onSavingsGoalSet, onCategoryBudgetsSet, currency, setCurrency,
  theme, toggleTheme
}) => {
  const { t, formatCurrency } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('management');
  
  // State for forms
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');
  const [newCategory, setNewCategory] = useState('');
  
  // State for confirmation modals
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const numericValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      setter(numericValue);
  };
  
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(newAccountBalance);
    if (newAccountName && !isNaN(balance)) {
      onAccountAdd({ name: newAccountName, initialBalance: balance });
      setNewAccountName('');
      setNewAccountBalance('');
    }
  };
  
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
        onCategoryAdd(newCategory);
        setNewCategory('');
    }
  }

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const numericValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      onSavingsGoalSet({ amount: parseFloat(numericValue) || 0 });
  };

  const handleBudgetChange = (category: ExpenseCategory, value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')) || 0;
    const newBudgets = { ...categoryBudgets };
    if (numericValue > 0) {
      newBudgets[category] = numericValue;
    } else {
      delete newBudgets[category];
    }
    onCategoryBudgetsSet(newBudgets);
  }

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-white";
  const buttonClasses = "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-colors disabled:opacity-50";
  
  const tabClasses = (tabName: SettingsTab) => 
    `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
      activeTab === tabName
        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-gray-600'
    }`;


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('management')} className={tabClasses('management')}>
                  {t('settingsManagementTitle')}
              </button>
              <button onClick={() => setActiveTab('appearance')} className={tabClasses('appearance')}>
                  {t('settingsAppearanceTitle')}
              </button>
          </nav>
      </div>
      
      {activeTab === 'appearance' && (
        <div className="space-y-6 animate-fade-in">
          <section className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('settingsTheme')}</h3>
            <div className="flex items-center justify-between">
                <label htmlFor="dark-mode-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('settingsDarkMode')}
                </label>
                <button
                    id="dark-mode-toggle"
                    onClick={toggleTheme}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={theme === 'dark'}
                >
                    <span
                        aria-hidden="true"
                        className={`${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                    />
                </button>
            </div>
          </section>

          <section className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('settingsLanguageAndCurrency')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settingsLanguage')}</label>
                    <LanguageToggle />
                </div>
                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settingsCurrency')}</label>
                    <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className={inputClasses}>
                        <option value="USD">{t('currency_USD')}</option>
                        <option value="EUR">{t('currency_EUR')}</option>
                        <option value="GBP">{t('currency_GBP')}</option>
                        <option value="JPY">{t('currency_JPY')}</option>
                    </select>
                </div>
            </div>
          </section>
        </div>
      )}
      
      {activeTab === 'management' && (
        <div className="space-y-6 animate-fade-in">
          <section className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('settingsAccounts')}</h3>
            <ul className="space-y-3 mb-4">
                {accounts.map(acc => (
                    <li key={acc.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-md">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{acc.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{t('settingsInitialBalance')}: {formatCurrency(acc.initialBalance)}</p>
                        </div>
                        <button onClick={() => setAccountToDelete(acc)} className="font-medium text-rose-600 dark:text-rose-500 hover:underline">{t('delete')}</button>
                    </li>
                ))}
                {accounts.length === 0 && <p className="text-slate-500 dark:text-slate-400">{t('noAccounts')}</p>}
            </ul>
            <form onSubmit={handleAddAccount} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-grow">
                <label htmlFor="accountName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settingsAccountName')}</label>
                <input type="text" id="accountName" value={newAccountName} onChange={e => setNewAccountName(e.target.value)} className={inputClasses} placeholder={t('placeholder_checking')} required/>
              </div>
              <div className="flex-grow">
                <label htmlFor="initialBalance" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settingsInitialBalance')}</label>
                <input type="text" inputMode="decimal" id="initialBalance" value={newAccountBalance} onChange={handleNumericInputChange(setNewAccountBalance)} className={inputClasses} placeholder="0.00" required/>
              </div>
              <button type="submit" className={buttonClasses} disabled={!newAccountName || !newAccountBalance}>{t('settingsAddAccount')}</button>
            </form>
          </section>

          <section className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('settingsCategories')}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(cat => (
                    <span key={cat} className="flex items-center bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 text-sm font-medium px-2.5 py-1 rounded-full">
                        {cat}
                        <button onClick={() => setCategoryToDelete(cat)} className="ml-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400">&times;</button>
                    </span>
                ))}
                {categories.length === 0 && <p className="text-slate-500 dark:text-slate-400">{t('noCategories')}</p>}
            </div>
            <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                <div className="flex-grow">
                    <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settingsCategoryName')}</label>
                    <input type="text" id="categoryName" value={newCategory} onChange={e => setNewCategory(e.target.value)} className={inputClasses} placeholder={t('placeholder_groceries')} required/>
                </div>
                <button type="submit" className={buttonClasses} disabled={!newCategory}>{t('settingsAddCategory')}</button>
            </form>
          </section>
      
          <section className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('settingsGoalsAndBudgets')}</h3>
            <div className="space-y-6">
                <div>
                    <label htmlFor="savingsGoal" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('settingsMonthlySavingsGoal')}</label>
                    <input type="text" inputMode="decimal" id="savingsGoal" value={savingsGoal.amount || ''} onChange={handleGoalChange} className={inputClasses} placeholder="0.00" />
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('categoryBudgetsTitle')}</h4>
                    <div className="space-y-4">
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center justify-between">
                                <label htmlFor={`budget-${cat}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat}</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    id={`budget-${cat}`}
                                    value={categoryBudgets[cat] || ''}
                                    onChange={e => handleBudgetChange(cat, e.target.value)}
                                    className={`${inputClasses} mt-0 w-1/2 sm:w-1/3`}
                                    placeholder="0.00"
                                />
                            </div>
                        ))}
                        {categories.length === 0 && <p className="text-slate-500 dark:text-slate-400">{t('noCategoriesForBudgets')}</p>}
                    </div>
                </div>
            </div>
          </section>
        </div>
      )}
      
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!accountToDelete}
        onClose={() => setAccountToDelete(null)}
        onConfirm={() => {
            if(accountToDelete) onAccountDelete(accountToDelete.id);
            setAccountToDelete(null);
        }}
        title={t('deleteAccountTitle')}
        message={t('deleteAccountMessage', { accountName: accountToDelete?.name || '' })}
      />
       <ConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
            if(categoryToDelete) onCategoryDelete(categoryToDelete);
            setCategoryToDelete(null);
        }}
        title={t('deleteCategoryTitle')}
        message={t('deleteCategoryMessage', { categoryName: categoryToDelete || '' })}
      />

    </div>
  );
};

export default Settings;
