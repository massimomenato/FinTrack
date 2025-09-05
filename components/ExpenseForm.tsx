
import React, { useState, useEffect } from 'react';
import type { Expense, Account, ExpenseFormData, ExpenseCategory } from '../types';
import { Recurrence } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseFormData) => void;
  onClose: () => void;
  accounts: Account[];
  expenseToEdit?: Expense | null;
  categories: string[];
}

interface FormDataState {
    title: string;
    amount: string;
    category: ExpenseCategory;
    date: string;
    accountId: string;
    recurrence: Recurrence;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onClose, accounts, expenseToEdit, categories }) => {
  const { t } = useTranslation();
  
  const getInitialFormData = (): FormDataState => ({
    title: '',
    amount: '',
    category: categories[0] || '',
    date: new Date().toISOString().split('T')[0],
    accountId: accounts[0]?.id || '',
    recurrence: Recurrence.NONE,
  });
  
  const [formData, setFormData] = useState<FormDataState>(getInitialFormData());

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title,
        amount: String(expenseToEdit.amount),
        category: expenseToEdit.category,
        date: expenseToEdit.date,
        accountId: expenseToEdit.accountId,
        recurrence: expenseToEdit.recurrence,
      });
    } else {
        setFormData(getInitialFormData());
    }
  }, [expenseToEdit, categories, accounts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const numericValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(formData.amount);
    if (!formData.title || isNaN(numericAmount) || numericAmount <= 0 || !formData.accountId || !formData.category) {
        alert(t('formRequiredFields'));
        return;
    }
    onSubmit({
        ...formData,
        amount: numericAmount,
    });
  };
  
  const inputClasses = "mt-1 block w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formTitle')}</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formAmount')}</label>
        <input type="text" inputMode="decimal" name="amount" id="amount" value={formData.amount} onChange={handleChange} className={inputClasses} required placeholder="0.00" />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formCategory')}</label>
        <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputClasses}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formDate')}</label>
        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="accountId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formAccount')}</label>
        <select name="accountId" id="accountId" value={formData.accountId} onChange={handleChange} className={inputClasses} required>
          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
        </select>
      </div>
       <div>
        <label htmlFor="recurrence" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formRecurrence')}</label>
        <select name="recurrence" id="recurrence" value={formData.recurrence} onChange={handleChange} className={inputClasses}>
          {Object.values(Recurrence).map(rec => <option key={rec} value={rec}>{t(`recurrence_${rec}`)}</option>)}
        </select>
      </div>
      <div className="flex justify-end pt-4 space-x-3">
        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-gray-600 dark:text-slate-200 dark:hover:bg-gray-500 font-semibold transition-colors">{t('formCancel')}</button>
        <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-colors">{t('formSaveExpense')}</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
