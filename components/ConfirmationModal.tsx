import React from 'react';
import Modal from './Modal';
import { useTranslation } from '../contexts/LanguageContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmButtonClassName?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmButtonClassName }) => {
  const { t } = useTranslation();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <p className="text-slate-600 dark:text-slate-300">{message}</p>
        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-gray-600 dark:text-slate-200 dark:hover:bg-gray-500 font-semibold transition-colors"
          >
            {t('formCancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmButtonClassName || "px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-semibold transition-colors"}
          >
            {confirmText || t('delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;