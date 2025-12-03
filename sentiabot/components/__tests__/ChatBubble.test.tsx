import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChatBubble } from '../ChatBubble';

describe('ChatBubble', () => {
  it('renders a user message correctly', () => {
    render(<ChatBubble message="Hello user" sender="user" />);
    const messageElement = screen.getByText('Hello user');
    expect(messageElement).toBeInTheDocument();
    
    // Check for user-specific styling
    const card = messageElement.closest('.bg-blue-500');
    expect(card).toBeInTheDocument();
  });

  it('renders a bot message correctly', () => {
    render(<ChatBubble message="Hello from bot" sender="bot" />);
    const messageElement = screen.getByText('Hello from bot');
    expect(messageElement).toBeInTheDocument();

    // Check for bot-specific styling
    const card = messageElement.closest('.bg-gray-200');
    expect(card).toBeInTheDocument();
  });

  it('does not render source links for a user message', () => {
    render(<ChatBubble message="Test" sender="user" sourceReferences={['http://source.com']} />);
    const sourceLink = screen.queryByText('Source');
    expect(sourceLink).not.toBeInTheDocument();
  });

  it('does not render source links when none are provided for a bot message', () => {
    render(<ChatBubble message="No sources here" sender="bot" />);
    const sourceLink = screen.queryByText('Source');
    expect(sourceLink).not.toBeInTheDocument();
  });

  it('renders a single source link for a bot message', () => {
    const sources = ['http://source.com/1'];
    render(<ChatBubble message="One source" sender="bot" sourceReferences={sources} />);
    
    const sourceLinks = screen.getAllByText('Source');
    expect(sourceLinks).toHaveLength(1);

    const linkElement = sourceLinks[0] as HTMLAnchorElement;
    expect(linkElement.href).toBe(sources[0]);
  });

  it('renders multiple source links for a bot message', () => {
    const sources = ['http://source.com/1', 'http://source.com/2'];
    render(<ChatBubble message="Two sources" sender="bot" sourceReferences={sources} />);
    
    const sourceLinks = screen.getAllByText('Source');
    expect(sourceLinks).toHaveLength(2);

    expect((sourceLinks[0] as HTMLAnchorElement).href).toBe(sources[0]);
    expect((sourceLinks[1] as HTMLAnchorElement).href).toBe(sources[1]);
  });
});
