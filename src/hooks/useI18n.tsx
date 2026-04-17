import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'sw';

interface Translation {
  [key: string]: string | Translation;
}

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Load translations from JSON files (dynamic import)
async function loadTranslations(lang: Language): Promise<Translation> {
  try {
    const module = await import(`../i18n/${lang}.json`);
    return module.default;
  } catch (err) {
    console.error(`Failed to load translations for ${lang}:`, err);
    return {};
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translation>({});
  const [loading, setLoading] = useState(true);

  const setLang = (newLang: Language) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  };

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language | null;
    const initialLang = (savedLang === 'en' || savedLang === 'sw') ? savedLang : 'en';
    setLangState(initialLang);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    setLoading(true);
    loadTranslations(lang).then((translationData) => {
      setTranslations(translationData);
      setLoading(false);
    });
  }, [lang]);

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined || value === null) {
        console.warn(`Missing translation key: ${path}`);
        return path;
      }
    }
    
    return String(value);
  };

  // Don't render children until translations are loaded
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}