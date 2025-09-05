import React, { useState } from 'react';
import Modal from './Modal';
import { useTranslation } from '../contexts/LanguageContext';

interface MultiSelectDropdownProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  buttonClassName?: string;
  isIconOnly?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedValues, onChange, placeholder, buttonClassName, isIconOnly = false }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };
  
  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
        onChange([]);
    } else {
        onChange(options.map(opt => opt.value));
    }
  }

  const getButtonLabel = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === options.length) return t('allAccounts');
    if (selectedValues.length === 1) {
        const selectedOption = options.find(opt => opt.value === selectedValues[0]);
        return selectedOption ? selectedOption.label : placeholder;
    }
    return `${selectedValues.length} ${t('accountsSelected')}`;
  }
  
  const defaultButtonClasses = "w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";


  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={buttonClassName || defaultButtonClasses}
      >
        {isIconOnly ? (
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {selectedValues.length > 0 && selectedValues.length < options.length && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-800"></span>
                    )}
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{getButtonLabel()}</span>
            </div>
        ) : (
          <>
            <span className="text-slate-800 dark:text-slate-200">{getButtonLabel()}</span>
            <svg className={`w-5 h-5 text-slate-500 transition-transform`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={placeholder} size="sm">
        <div className="max-h-96 overflow-y-auto -mx-6 -my-4">
          <ul className="py-2 space-y-1">
            <li className="px-2">
                <label className="flex items-center w-full px-2 py-2 text-sm font-medium text-slate-900 dark:text-white rounded-md hover:bg-slate-100 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedValues.length === options.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3">{t('allAccounts')}</span>
                </label>
            </li>
             <div className="border-t border-slate-200 dark:border-gray-700 my-1 mx-4"></div>
            {options.map(option => (
              <li key={option.value} className="px-2">
                <label className="flex items-center w-full px-2 py-2 text-sm text-slate-900 dark:text-white rounded-md hover:bg-slate-100 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedValues.includes(option.value)}
                    onChange={() => handleSelect(option.value)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3">{option.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default MultiSelectDropdown;