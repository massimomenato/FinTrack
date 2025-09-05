import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import MonthYearPicker from './MonthYearPicker';
import { useTranslation } from '../contexts/LanguageContext';
import type { Expense, Income } from '../types';

interface DateNavigatorProps {
  viewDate: Date;
  setViewDate: (date: Date) => void;
  expenses: Pick<Expense, 'date'>[];
  incomes: Pick<Income, 'date'>[];
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ viewDate, setViewDate, expenses, incomes }) => {
  const { locale, t } = useTranslation();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const transactionMonths = useMemo(() => {
    const dates = new Set<string>();
    [...expenses, ...incomes].forEach(item => {
        const d = new Date(item.date);
        dates.add(`${d.getFullYear()}-${d.getMonth()}`);
    });
    return Array.from(dates).map(dStr => {
        const [year, month] = dStr.split('-').map(Number);
        return new Date(year, month, 1);
    });
  }, [expenses, incomes]);

  const handleDateChange = (date: Date) => {
    setViewDate(date);
    setIsPickerOpen(false);
  };
  
  const rawDate = viewDate.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);


  return (
    <>
      <button 
        onClick={() => setIsPickerOpen(true)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('changeMonth')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {formattedDate}
        </span>
      </button>
      <Modal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title={t('changeMonth')}
        size="sm"
      >
        <div className="flex justify-center">
          <MonthYearPicker
            currentDate={viewDate}
            onChange={handleDateChange}
            transactionMonths={transactionMonths}
          />
        </div>
      </Modal>
    </>
  );
};

export default DateNavigator;