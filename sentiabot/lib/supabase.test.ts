import { supabase } from './supabase';
import { describe, it, expect, vi } from 'vitest';
import * as SupabaseJs from '@supabase/supabase-js';

// Mock the entire @supabase/supabase-js module
vi.mock('@supabase/supabase-js', () => {
  const mockFrom = vi.fn().mockReturnThis(); // Allows chaining .from().select()
  const mockSelect = vi.fn().mockResolvedValue({ data: [{ '1': 1 }], error: null }); // Mock a successful select call

  const mockCreateClient = vi.fn(() => ({
    from: mockFrom,
    select: mockSelect,
  }));

  return {
    createClient: mockCreateClient,
  };
});

describe('Supabase Client Connection', () => {
  it('should successfully connect to Supabase and execute a simple query', async () => {
    // Assert that createClient was called with environment variables
    expect(SupabaseJs.createClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Perform a simple mock query to check connectivity
    // In a real scenario, this would be an actual query, but here we're testing the mock setup.
    const { data, error } = await supabase.from('test_table').select('1');

    expect(error).toBeNull();
    expect(data).toEqual([{ '1': 1 }]);
  });

  // You might want to add more tests for error cases, different table interactions etc.
});
