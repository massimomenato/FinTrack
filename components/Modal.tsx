
import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from '../contexts/LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={`relative w-full ${sizeClasses[size]} p-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800 transform transition-all`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 dark:text-slate-400"
            aria-label={t('close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
      const root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
      return ReactDOM.createPortal(modalContent, root);
  }

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
