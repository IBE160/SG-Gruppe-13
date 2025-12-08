import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Set mock environment variables for tests
process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock browser APIs not implemented in JSDOM
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Mock the fetch API for all tests (can be overridden in specific tests)
global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
})) as unknown as typeof fetch; // Use type assertion to typeof fetch