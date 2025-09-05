import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

type Language = 'en' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  locale: string;
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
  const [currency, setCurrency] = useLocalStorage<string>('currency', 'USD');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Using an absolute path from the root of the site.
        const response = await fetch(`/i18n/${language}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${language}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Error loading translations:", error);
        // Fallback to English if the selected language fails to load.
        if (language !== 'en') {
          try {
            const fallbackResponse = await fetch(`/i18n/en.json`);
            if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                setTranslations(fallbackData);
            }
          } catch (fallbackError) {
             console.error("Error loading fallback translations:", fallbackError);
          }
        }
      }
    };
    loadTranslations();
  }, [language]);

  const locale = useMemo(() => (language === 'it' ? 'it-IT' : 'en-US'), [language]);

  const t = useCallback((key: string, replacements: { [key: string]: string | number } = {}) => {
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
    });
    return translation;
  }, [translations]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }, [locale, currency]);

  const value = {
    language,
    setLanguage,
    t,
    locale,
    currency,
    setCurrency,
    formatCurrency,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};