import '@testing-library/jest-dom';

// Mock environment variables for Supabase client connection test
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock_anon_key';
