import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ChatBubble } from '../ChatBubble';
import { SourcedLink } from '../SourcedLink'; // Import the actual SourcedLink component

// Mock the SourcedLink component to track its usage and simplify tests
vi.mock('../SourcedLink', () => ({
  SourcedLink: vi.fn(({ source }) => <div data-testid="mock-sourced-link">{source.label}</div>),
}));

describe('ChatBubble', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    vi.clearAllMocks();
  });

  it('renders a user message correctly without sources', () => {
    const userMessage = { text: 'Hello, Sentiabot!', isUser: true };
    render(<ChatBubble message={userMessage} />);

    expect(screen.getByText('Hello, Sentiabot!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy message/i })).toBeInTheDocument();
    expect(screen.queryByTestId('mock-sourced-link')).not.toBeInTheDocument();
    expect(SourcedLink).not.toHaveBeenCalled(); // Ensure SourcedLink was not called
  });

  it('renders a bot message correctly without sources', () => {
    const botMessage = { text: 'Hello! How can I help you today?', isUser: false };
    render(<ChatBubble message={botMessage} />);

    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy message/i })).toBeInTheDocument();
    expect(screen.queryByTestId('mock-sourced-link')).not.toBeInTheDocument();
    expect(SourcedLink).not.toHaveBeenCalled(); // Ensure SourcedLink was not called
  });

  it('renders a bot message with a single source reference', () => {
    const botMessageWithSource = {
      text: 'Here is some information.',
      isUser: false,
      sourceReferences: [{ label: 'Source 1', url: 'http://example.com/source1' }],
    };
    render(<ChatBubble message={botMessageWithSource} />);

    expect(screen.getByText('Here is some information.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy message/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-sourced-link')).toBeInTheDocument(); // Expect the mock to be rendered
    expect(SourcedLink).toHaveBeenCalledTimes(1);
    expect(SourcedLink).toHaveBeenCalledWith(expect.objectContaining({ source: { label: 'Source 1', url: 'http://example.com/source1' } }), undefined);
  });

  it('renders a bot message with multiple source references', () => {
    const botMessageWithSources = {
      text: 'Multiple sources for you.',
      isUser: false,
      sourceReferences: [
        { label: 'Source A', url: 'http://example.com/sourceA' },
        { label: 'Source B', url: 'http://example.com/sourceB' },
      ],
    };
    render(<ChatBubble message={botMessageWithSources} />);

    expect(screen.getByText('Multiple sources for you.')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-sourced-link')).toHaveLength(2); // Expect two mock links
    expect(SourcedLink).toHaveBeenCalledTimes(2);
    expect(SourcedLink).toHaveBeenCalledWith(expect.objectContaining({ source: { label: 'Source A', url: 'http://example.com/sourceA' } }), undefined);
    expect(SourcedLink).toHaveBeenCalledWith(expect.objectContaining({ source: { label: 'Source B', url: 'http://example.com/sourceB' } }), undefined);
  });

  it('does not render source references for a user message, even if provided', () => {
    const userMessageWithSource = {
      text: 'My question from a source.',
      isUser: true,
      sourceReferences: [{ label: 'My Source', url: 'http://example.com/myquestion' }],
    };
    render(<ChatBubble message={userMessageWithSource} />);

    expect(screen.getByText('My question from a source.')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-sourced-link')).not.toBeInTheDocument();
    expect(SourcedLink).not.toHaveBeenCalled();
  });
});
