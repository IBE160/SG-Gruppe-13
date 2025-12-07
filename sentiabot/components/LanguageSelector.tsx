'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLanguagePreference, setLanguagePreference } from '@/lib/user-preferences';

const LanguageSelector = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const preferredLanguage = getLanguagePreference();
    if (preferredLanguage) {
      setLanguage(preferredLanguage);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setLanguagePreference(value);
    // Reload the page to apply language changes throughout the app
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm font-medium">
        Language
      </label>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px]" id="language-select">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="no">Norwegian</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
