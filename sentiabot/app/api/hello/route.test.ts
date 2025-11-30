import { GET } from './route';
import { NextResponse } from 'next/server';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/server', async (importOriginal) => {
  const mod = await importOriginal<typeof NextResponse>();
  return {
    ...mod,
    NextResponse: {
      json: vi.fn((data) => ({ json: () => Promise.resolve(data) })),
    },
  };
});

describe('GET /api/hello', () => {
  it('should return a JSON response with "Hello World"', async () => {
    // Mock the Request object if your GET function uses it.
    // In this case, GET does not use the request object, so we can pass an empty object.
    const response = await GET();

    // Ensure NextResponse.json was called with the correct data
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'Hello World' });

    // Assert the resolved JSON content
    const data = await response.json();
    expect(data).toEqual({ message: 'Hello World' });
  });
});
