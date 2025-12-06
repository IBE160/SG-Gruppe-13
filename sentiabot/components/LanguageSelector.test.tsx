// sentabot/components/LanguageSelector.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from './LanguageSelector';
import * as userPreferences from '@/lib/user-preferences';
import { vi } from 'vitest';

// Mock the user-preferences module
vi.mock('@/lib/user-preferences', () => ({
  getLanguagePreference: vi.fn(),
  setLanguagePreference: vi.fn(),
}));

// Mock window.location.reload
const reload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload },
  writable: true,
});

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render and default to English', () => {
    (userPreferences.getLanguagePreference as vi.Mock).mockReturnValue(null);
    render(<LanguageSelector />);
    
    expect(screen.getByText('Language')).toBeInTheDocument();
    // In Shadcn, the displayed value is inside the trigger
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should initialize with the language from localStorage', () => {
    (userPreferences.getLanguagePreference as vi.Mock).mockReturnValue('no');
    render(<LanguageSelector />);
    
    expect(screen.getByText('Norwegian')).toBeInTheDocument();
  });

  it('should change language, call setLanguagePreference, and reload the page', () => {
    (userPreferences.getLanguagePreference as vi.Mock).mockReturnValue('en');
    render(<LanguageSelector />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // After clicking the trigger, the options should be visible.
    // We'll find the 'Norwegian' option and click it.
    const norwegianOption = screen.getByText('Norwegian');
    fireEvent.click(norwegianOption);

    // Check that the preference was set
    expect(userPreferences.setLanguagePreference).toHaveBeenCalledWith('no');

    // Check that the page was reloaded
    expect(window.location.reload).toHaveBeenCalled();
  });
});
