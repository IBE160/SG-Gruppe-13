import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import { vi } from 'vitest';

// Mock the ChatInput component
vi.mock('@/components/ChatInput', () => ({
  ChatInput: ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
    // For testing, we'll expose a way to trigger onSendMessage directly
    return (
      <button
        data-testid="send-message-button-mock"
        onClick={() => {
          // In a real scenario, this would come from the input value
          // For this test, we hardcode the message that the test expects
          onSendMessage('What is the capital of France?');
        }}
      >
        Send
      </button>
    );
  },
}));

// Mock the fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Hello there! I'm Sentiabot, ready to help you learn." }),
  }),
) as any;

describe('Home Page', () => {
  it('renders the main application layout', () => {
    render(<Home />);
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
  });

  it('displays user and bot messages after user input and static response', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const sendMessageButton = screen.getByTestId('send-message-button-mock');
    await user.click(sendMessageButton);

    const userMessageText = 'What is the capital of France?';

    // Expect user message to appear
    await waitFor(() => {
      expect(screen.getByText(userMessageText)).toBeInTheDocument();
    });

    // Expect bot message to appear after fetch mock resolves
    await waitFor(() => {
      expect(screen.getByText("Hello there! I'm Sentiabot, ready to help you learn.")).toBeInTheDocument();
    });
  });
});
