import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'; // Import within
import Home from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Home page - Chat Integration Test', () => {
    let resolveFetch: (value: any) => void;
    let rejectFetch: (reason?: any) => void;

    beforeEach(() => {
        // Mock the fetch API before each test
        global.fetch = vi.fn(() => {
            return new Promise((resolve, reject) => {
                resolveFetch = resolve;
                rejectFetch = reject;
            });
        });
    });

    it('should handle the full chat flow: user message, loading indicator, and bot response with source', async () => {
        const mockApiResponse = {
            aiResponse: 'This is a test response.',
            sourceReferences: ['http://example.com/source'],
            sessionId: 'test-session-id',
        };

        render(<Home />);

        // --- Simulate WelcomeScreen interaction ---
        // 1. Select Subject
        const subjectSelectTrigger = screen.getByLabelText('Subject');
        fireEvent.click(subjectSelectTrigger);
        await waitFor(() => screen.getByText('Biology'));
        fireEvent.click(screen.getByText('Biology'));

        // 2. Select Grade Level
        const gradeSelectTrigger = screen.getByLabelText('Grade Level');
        fireEvent.click(gradeSelectTrigger);
        await waitFor(() => screen.getByText('Grade 1'));
        fireEvent.click(screen.getByText('Grade 1'));

        // 3. Click Start Chatting
        fireEvent.click(screen.getByRole('button', { name: 'Start Chatting' }));

        // Assert welcome message from bot
        await waitFor(() => {
            expect(screen.getByText(/I'm ready to help you with biology for Grade 1/i)).toBeInTheDocument();
        });
        // --- End WelcomeScreen interaction ---

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

        // Now, resolve the fetch call
        resolveFetch({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
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
            body: JSON.stringify({
                message: 'Hello Sentiabot',
                context: {
                    subject: 'biology',
                    gradeLevel: '1',
                },
                sessionId: null, // Expecting sessionId to be null for the first message
            }),
        });
    });
});
