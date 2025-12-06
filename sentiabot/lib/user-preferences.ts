// src/lib/user-preferences.ts

export const getLanguagePreference = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('preferredLanguage');
  }
  return null;
};

export const setLanguagePreference = (language: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferredLanguage', language);
  }
};
