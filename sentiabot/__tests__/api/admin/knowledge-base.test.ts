import { describe, it, expect, vi } from 'vitest';
import { POST, PUT, DELETE } from '@/app/api/admin/knowledge-base/route';
import { NextResponse } from 'next/server';

// Mock NextResponse for testing API routes
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({ json: () => Promise.resolve(data), status: options?.status || 200 })),
  },
}));

describe('Knowledge Base Admin API', () => {
  describe('POST /api/admin/knowledge-base', () => {
    it('should create a new knowledge base entry successfully', async () => {
      const mockRequest = {
        json: () => Promise.resolve({
          title: 'Test Title',
          content: 'Test Content',
          source_url: 'https://test.com',
        }),
      } as Request;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Knowledge base entry created successfully (simulated).',
          entry: expect.objectContaining({
            title: 'Test Title',
            content: 'Test Content',
            source_url: 'https://test.com',
          }),
        }),
        { status: 201 }
      );
      expect(data.entry).toHaveProperty('id');
      expect(data.entry).toHaveProperty('created_at');
    });

    it('should handle errors during creation', async () => {
      const mockRequest = {
        json: () => Promise.reject(new Error('Invalid JSON')),
      } as Request;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error creating knowledge base entry.',
          error: 'Invalid JSON',
        }),
        { status: 500 }
      );
    });
  });

  describe('PUT /api/admin/knowledge-base', () => {
    it('should update an existing knowledge base entry successfully', async () => {
      const mockRequest = {
        json: () => Promise.resolve({
          id: 123,
          title: 'Updated Title',
          content: 'Updated Content',
          source_url: 'https://updated.com',
        }),
      } as Request;

      const response = await PUT(mockRequest);
      const data = await response.json();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Knowledge base entry updated successfully (simulated).',
          entry: expect.objectContaining({
            id: 123,
            title: 'Updated Title',
            content: 'Updated Content',
            source_url: 'https://updated.com',
          }),
        }),
        { status: 200 }
      );
      expect(data.entry).toHaveProperty('updated_at');
    });

    it('should handle errors during update', async () => {
      const mockRequest = {
        json: () => Promise.reject(new Error('Update failed')),
      } as Request;

      const response = await PUT(mockRequest);
      const data = await response.json();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error updating knowledge base entry.',
          error: 'Update failed',
        }),
        { status: 500 }
      );
    });
  });

  describe('DELETE /api/admin/knowledge-base', () => {
    it('should delete a knowledge base entry successfully', async () => {
      const mockRequest = {
        url: 'http://localhost/api/admin/knowledge-base?id=456',
      } as Request;

      const response = await DELETE(mockRequest);
      const data = await response.json();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Knowledge base entry with ID 456 deleted successfully (simulated).',
          id: '456',
        }),
        { status: 200 }
      );
    });

    it('should return 400 if ID is missing for deletion', async () => {
      const mockRequest = {
        url: 'http://localhost/api/admin/knowledge-base', // No ID
      } as Request;

      const response = await DELETE(mockRequest);
      const data = await response.json();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing ID for knowledge base entry deletion.',
        }),
        { status: 400 }
      );
    });

    it('should handle errors during deletion', async () => {
      // Temporarily mock global.URL for this specific test case
      const originalURL = global.URL;
      global.URL = class MockURL extends originalURL {
        constructor(url: string, base?: string) {
          if (url === 'invalid-url') {
            throw new Error('Failed to parse URL');
          }
          super(url, base);
        }
      } as any;

      const mockRequest = {
        url: 'invalid-url', // This will trigger the mocked URL to throw an error
      } as Request;
      
      const response = await DELETE(mockRequest);
      const data = await response.json();

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error deleting knowledge base entry.',
          error: 'Failed to parse URL',
        }),
        { status: 500 }
      );
      global.URL = originalURL; // Restore original URL mock
    });
  });
});