import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface MonthYearPickerProps {
  currentDate: Date;
  onChange: (date: Date) => void;
  transactionMonths: Date[];
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ currentDate, onChange, transactionMonths }) => {
  const { locale, t } = useTranslation();
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());
  
  const activeMonthsSet = useMemo(() => new Set(
    transactionMonths.map(d => `${d.getFullYear()}-${d.getMonth()}`)
  ), [transactionMonths]);

  useEffect(() => {
    setDisplayYear(currentDate.getFullYear());
  }, [currentDate]);

  const months = Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(displayYear, i).toLocaleDateString(locale, { month: 'short' });
      return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  });

  const selectMonth = (monthIndex: number) => {
    onChange(new Date(displayYear, monthIndex, 1));
  };

  return (
    <div className="w-64">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setDisplayYear(displayYear - 1)}
          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700"
          aria-label={t('previousYear')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{displayYear}</span>
        <button
          onClick={() => setDisplayYear(displayYear + 1)}
          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700"
          aria-label={t('nextYear')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {months.map((month, index) => {
            const isCurrent = currentDate.getFullYear() === displayYear && currentDate.getMonth() === index;
            const isActive = activeMonthsSet.has(`${displayYear}-${index}`);

            return (
              <button
                key={month}
                onClick={() => selectMonth(index)}
                disabled={!isActive}
                className={`p-2 text-sm text-center rounded-md transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-semibold'
                    : isActive
                        ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700'
                        : 'text-slate-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                {month}
              </button>
            );
        })}
      </div>
    </div>
  );
};

export default MonthYearPicker;