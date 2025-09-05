import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const activeClasses = 'bg-indigo-600 text-white shadow-sm';
  const inactiveClasses = 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600';

  return (
    <div className="mt-1 flex items-center p-1 space-x-1 bg-slate-100 dark:bg-gray-700 rounded-lg w-full">
      <button
        onClick={() => setLanguage('en')}
        className={`w-1/2 text-center px-3 py-1 text-sm font-semibold rounded-md transition-colors ${language === 'en' ? activeClasses : inactiveClasses}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('it')}
        className={`w-1/2 text-center px-3 py-1 text-sm font-semibold rounded-md transition-colors ${language === 'it' ? activeClasses : inactiveClasses}`}
      >
        IT
      </button>
    </div>
  );
};

export default LanguageToggle;