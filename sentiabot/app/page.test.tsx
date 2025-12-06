import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'; // Import within
import Home from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Home page - Chat Integration Test', () => {
    const mockApiResponse = {
        aiResponse: 'This is a test response.',
        sourceReferences: [{ label: 'Example Source', url: 'http://example.com/source' }],
        sessionId: 'test-session-id',
    };

    beforeEach(() => {
        vi.clearAllMocks(); // Clear any previous mocks

        // Mock the fetch API to immediately resolve
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockApiResponse),
            }) as Promise<Response>
        );
    });

    it('should handle the full chat flow: user message, loading indicator, and bot response with source', async () => {

        render(<Home />);

        // --- Simulate WelcomeScreen interaction ---
        // 1. Select Subject
        const subjectSelectTrigger = screen.getByRole('combobox', { name: /Subject/i });
        fireEvent.click(subjectSelectTrigger);
        await waitFor(() => screen.getByRole('option', { name: 'Biology' }));
        fireEvent.click(screen.getByRole('option', { name: 'Biology' }));

        // 2. Select Grade Level
        const gradeSelectTrigger = screen.getByRole('combobox', { name: /Grade Level/i });
        fireEvent.click(gradeSelectTrigger);
        await waitFor(() => screen.getByRole('option', { name: 'Grade 1' }));
        fireEvent.click(screen.getByRole('option', { name: 'Grade 1' }));

        // 3. Click Start Chatting
        fireEvent.click(screen.getByRole('button', { name: 'Start Chatting' }));

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

        // Now, fetch is mocked to resolve immediately.
        // Assert bot's response and source link appear after fetch completes
        await waitFor(() => {
            expect(screen.getByText('This is a test response.')).toBeInTheDocument();
            expect(screen.getByText('Example Source')).toHaveAttribute('href', 'http://example.com/source');
        });

        // Verify fetch was called correctly
        expect(fetch).toHaveBeenCalledWith('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Hello Sentiabot',
                context: {
                    subject: 'biology',
                    gradeLevel: '1',
                    language: 'en', // <-- Add this line
                },
                sessionId: null, // Expecting sessionId to be null for the first message
            }),
        });
    });
});
