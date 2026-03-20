'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '\u{1F1FA}\u{1F1F8}', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '\u{1F1EA}\u{1F1F8}', nativeName: 'Espa\u00f1ol' },
  { code: 'fr', name: 'French', flag: '\u{1F1EB}\u{1F1F7}', nativeName: 'Fran\u00e7ais' },
  { code: 'de', name: 'German', flag: '\u{1F1E9}\u{1F1EA}', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', flag: '\u{1F1E7}\u{1F1F7}', nativeName: 'Portugu\u00eas' },
  { code: 'hi', name: 'Hindi', flag: '\u{1F1EE}\u{1F1F3}', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940' },
];

const STORAGE_KEY = 'profileai-analysis-language';

export function useAnalysisLanguage() {
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const found = LANGUAGES.find((l) => l.code === stored);
      if (found) setLanguage(found);
    }
  }, []);

  const setAndPersist = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang.code);
  };

  return { language, setLanguage: setAndPersist };
}

export function LanguageSelector({
  value,
  onChange,
}: {
  value: Language;
  onChange: (lang: Language) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-800 text-sm transition-all"
      >
        <Globe className="h-4 w-4 text-indigo-400" />
        <span className="text-lg leading-none">{value.flag}</span>
        <span className="text-zinc-300 dark:text-zinc-300">{value.name}</span>
        <svg className="h-3 w-3 text-zinc-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 w-56 rounded-lg border border-zinc-700 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-900 shadow-xl py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-zinc-800 dark:hover:bg-zinc-800 transition-colors ${
                  value.code === lang.code
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-zinc-300 dark:text-zinc-300'
                }`}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                <span className="text-xs text-zinc-500">{lang.nativeName}</span>
                {value.code === lang.code && (
                  <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function LanguageBadge({ language }: { language: Language }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
      <span>{language.flag}</span>
      {language.name}
    </span>
  );
}
