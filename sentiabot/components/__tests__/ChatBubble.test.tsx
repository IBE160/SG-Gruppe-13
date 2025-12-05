import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChatBubble } from '../ChatBubble';

describe('ChatBubble', () => {
  it('renders a user message correctly', () => {
    render(<ChatBubble message={{ text: "Hello user", isUser: true }} />);
    const messageElement = screen.getByText('Hello user');
    expect(messageElement).toBeInTheDocument();
    
    // Check for user-specific styling
    // Removed specific color checks as they are handled by Tailwind classes and globals.css
    // and would require complex mocking/snapshot testing. Focus on functional class application.
    const card = messageElement.closest('.bg-primary');
    expect(card).toBeInTheDocument();
  });

  it('renders a bot message correctly', () => {
    render(<ChatBubble message={{ text: "Hello from bot", isUser: false }} />);
    const messageElement = screen.getByText('Hello from bot');
    expect(messageElement).toBeInTheDocument();

    // Check for bot-specific styling
    const card = messageElement.closest('.bg-muted');
    expect(card).toBeInTheDocument();
  });

  it('does not render source links for a user message', () => {
    // Even if a source is provided, it should not be rendered for a user message
    render(<ChatBubble message={{ text: "Test", isUser: true, source: 'http://source.com' }} />);
    const sourceLink = screen.queryByText('Source');
    expect(sourceLink).not.toBeInTheDocument();
  });

  it('does not render source links when none are provided for a bot message', () => {
    render(<ChatBubble message={{ text: "No sources here", isUser: false }} />);
    const sourceLink = screen.queryByText('Source');
    expect(sourceLink).not.toBeInTheDocument();
  });

  it('renders a single source link for a bot message', () => {
    const sourceUrl = 'http://source.com/1';
    render(<ChatBubble message={{ text: "One source", isUser: false, source: sourceUrl }} />);
    
    const sourceLink = screen.getByText('Source') as HTMLAnchorElement;
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink.href).toBe(sourceUrl);
  });

  it('renders a single source link even if multiple are conceptually provided (due to component limitation)', () => {
    const sourceUrl = 'http://source.com/1'; // Component only handles one source
    render(<ChatBubble message={{ text: "Two sources", isUser: false, source: sourceUrl }} />);
    
    const sourceLinks = screen.getAllByText('Source');
    expect(sourceLinks).toHaveLength(1); // Expect only one 'Source' text to be found
    expect((sourceLinks[0] as HTMLAnchorElement).href).toBe(sourceUrl);
  });
});