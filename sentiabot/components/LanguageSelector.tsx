'use client';

import * as React from 'react';
import { useState } from 'react'; // Removed useEffect import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLanguagePreference, setLanguagePreference } from '@/lib/user-preferences';

const LanguageSelector = () => {
  const [language, setLanguage] = useState<string>(() => {
    // Lazy initializer: runs only once during initial render
    const preferredLanguage = getLanguagePreference();
    return preferredLanguage || 'en'; // Default to 'en' if no preference
  });

  // Removed useEffect for initial language setting

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
          <SelectItem value="norwegian">Norwegian</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
