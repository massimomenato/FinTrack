
import React, { useState, useEffect } from 'react';
import type { Income, Account, IncomeFormData } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface IncomeFormProps {
  onSubmit: (income: IncomeFormData) => void;
  onClose: () => void;
  accounts: Account[];
  incomeToEdit?: Income | null;
}

interface FormDataState {
    title: string;
    amount: string;
    date: string;
    accountId: string;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onSubmit, onClose, accounts, incomeToEdit }) => {
  const { t } = useTranslation();

  const getInitialFormData = (): FormDataState => ({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    accountId: accounts[0]?.id || '',
  });

  const [formData, setFormData] = useState<FormDataState>(getInitialFormData());

  useEffect(() => {
    if (incomeToEdit) {
      setFormData({
        title: incomeToEdit.title,
        amount: String(incomeToEdit.amount),
        date: incomeToEdit.date,
        accountId: incomeToEdit.accountId,
      });
    } else {
        setFormData(getInitialFormData());
    }
  }, [incomeToEdit, accounts]);

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
    if (!formData.title || isNaN(numericAmount) || numericAmount <= 0 || !formData.accountId) {
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
        <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formDate')}</label>
        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="accountId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('formAccount')}</label>
        <select name="accountId" id="accountId" value={formData.accountId} onChange={handleChange} className={inputClasses} required>
          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
        </select>
      </div>
      <div className="flex justify-end pt-4 space-x-3">
        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-gray-600 dark:text-slate-200 dark:hover:bg-gray-500 font-semibold transition-colors">{t('formCancel')}</button>
        <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-colors">{t('formSaveIncome')}</button>
      </div>
    </form>
  );
};

export default IncomeForm;
