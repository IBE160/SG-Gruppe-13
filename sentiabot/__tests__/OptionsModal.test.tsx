// sentiabot/__tests__/OptionsModal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import OptionsModal from '@/components/OptionsModal';
import {
  fetchChatHistory,
  formatChatHistoryAsText,
  downloadChatHistoryFile,
} from '@/lib/chat-history-service'; // Import the actual functions to access their mocked versions

vi.mock('@/lib/chat-history-service'); // Vitest will hoist this and use its own factory function for creating mocks

// Mock the Button component if it has complex logic, otherwise use actual
// Since we are testing OptionsModal, we want to ensure Button from ui/button is used.
// We only need to mock the lucide-react Settings icon to avoid SVG issues in JSDOM
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    Settings: vi.fn(() => <svg data-testid="settings-icon" />), // Mock the Settings icon
  };
});


describe('OptionsModal', () => {
  const mockSessionId = 'test-session-id-123';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchChatHistory).mockResolvedValue([]); // Default mock resolved value
    vi.mocked(formatChatHistoryAsText).mockReturnValue(''); // Default mock return value
  });

  it('renders the OptionsModal and the Download Chat button', () => {
    render(<OptionsModal sessionId={mockSessionId} />);

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /toggle options/i }));

    // Check if the "Download Chat" button is present inside the dialog
    expect(screen.getByRole('button', { name: /Download Chat/i })).toBeInTheDocument();
  });

  it('calls download functions when "Download Chat" button is clicked', async () => {
    const mockHistory = [
      { id: '1', sender: 'user', text: 'Hi', timestamp: '2025-01-01T12:00:00Z' },
      { id: '2', sender: 'bot', text: 'Hello', timestamp: '2025-01-01T12:01:00Z' },
    ];
    const mockFormattedText = '[1/1/2025, 12:00:00 PM] USER: Hi\n\n[1/1/2025, 12:01:00 PM] BOT: Hello\n';
    const expectedFilename = `sentiabot-chat-history-${mockSessionId}.txt`;

    vi.mocked(fetchChatHistory).mockResolvedValue(mockHistory);
    vi.mocked(formatChatHistoryAsText).mockReturnValue(mockFormattedText);

    render(<OptionsModal sessionId={mockSessionId} />);

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /toggle options/i }));

    // Click the "Download Chat" button
    fireEvent.click(screen.getByRole('button', { name: /Download Chat/i }));

    await waitFor(() => {
      expect(vi.mocked(fetchChatHistory)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(fetchChatHistory)).toHaveBeenCalledWith(mockSessionId);

      expect(vi.mocked(formatChatHistoryAsText)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(formatChatHistoryAsText)).toHaveBeenCalledWith(mockHistory);

      expect(vi.mocked(downloadChatHistoryFile)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(downloadChatHistoryFile)).toHaveBeenCalledWith(mockFormattedText, expectedFilename);
    });
  });

  it('logs an error if session ID is not provided to the modal', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<OptionsModal sessionId="" />); // Render with empty sessionId

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /toggle options/i }));

    // Click the "Download Chat" button
    fireEvent.click(screen.getByRole('button', { name: /Download Chat/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('No session ID available for download.');
      expect(vi.mocked(fetchChatHistory)).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles errors during chat history fetch', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(fetchChatHistory).mockRejectedValue(new Error('Network error'));

    render(<OptionsModal sessionId={mockSessionId} />);

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /toggle options/i }));

    // Click the "Download Chat" button
    fireEvent.click(screen.getByRole('button', { name: /Download Chat/i }));

    await waitFor(() => {
      expect(vi.mocked(fetchChatHistory)).toHaveBeenCalledWith(mockSessionId);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error during chat history download:',
        expect.any(Error)
      );
      expect(vi.mocked(formatChatHistoryAsText)).not.toHaveBeenCalled();
      expect(vi.mocked(downloadChatHistoryFile)).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
