import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest'; // Import vi from vitest
import { ChatInput } from '../ChatInput';

describe('ChatInput', () => {
  it('calls onSendMessage with input value and clears input on Enter key press', () => {
    const mockOnSendMessage = vi.fn(); // Use vi.fn()
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const inputElement = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(inputElement, { target: { value: 'Hello Sentiabot' } });
    fireEvent.keyPress(inputElement, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello Sentiabot');
    expect(inputElement).toHaveValue('');
  });

  it('calls onSendMessage with input value and clears input on Send button click', () => {
    const mockOnSendMessage = vi.fn(); // Use vi.fn()
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const inputElement = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(inputElement, { target: { value: 'Another message' } });

    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    expect(mockOnSendMessage).toHaveBeenCalledWith('Another message');
    expect(inputElement).toHaveValue('');
  });

  it('does not call onSendMessage if input is empty', () => {
    const mockOnSendMessage = vi.fn(); // Use vi.fn()
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const inputElement = screen.getByPlaceholderText('Type your message...');
    fireEvent.keyPress(inputElement, { key: 'Enter', code: 13, charCode: 13 });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(mockOnSendMessage).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('');
  });
});
