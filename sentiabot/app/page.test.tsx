import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Home page - Chat Integration Test', () => {
    beforeEach(() => {
        // Mock the fetch API before each test
        global.fetch = vi.fn();
    });

    it('should handle the full chat flow: user message, loading indicator, and bot response with source', async () => {
        const mockApiResponse = {
            aiResponse: 'This is a test response.',
            sourceReferences: ['http://example.com/source'],
        };
        (fetch as any).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        render(<Home />);

        const inputElement = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByText('Send');

        // 1. User sends a message
        fireEvent.change(inputElement, { target: { value: 'Hello Sentiabot' } });
        fireEvent.click(sendButton);

        // 2. Assert user's message appears immediately
        await waitFor(() => {
            expect(screen.getByText('Hello Sentiabot')).toBeInTheDocument();
        });

        // 3. Assert loading indicator is displayed while waiting for the bot's response
        await waitFor(() => {
            expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
        });

        // 4. Assert bot's response and source link appear after fetch completes
        await waitFor(() => {
            expect(screen.getByText('This is a test response.')).toBeInTheDocument();
            expect(screen.getByText('Source')).toHaveAttribute('href', 'http://example.com/source');
        });

        // 5. Assert loading indicator is removed
        expect(screen.queryByTestId('typing-indicator')).not.toBeInTheDocument();

        // Verify fetch was called correctly
        expect(fetch).toHaveBeenCalledWith('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello Sentiabot' }),
        });
    });
});
