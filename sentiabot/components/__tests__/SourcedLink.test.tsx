import { render, screen } from '@testing-library/react';
import { SourcedLink } from '../SourcedLink';

describe('SourcedLink', () => {
  const testSource = { label: 'Example Source', url: 'http://example.com/test-document' };

  it('renders a link with the correct href and label', () => {
    render(<SourcedLink source={testSource} />);
    const linkElement = screen.getByRole('link', { name: /example source/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', testSource.url);
  });

  it('opens in a new tab with noopener noreferrer attributes', () => {
    render(<SourcedLink source={testSource} />);
    const linkElement = screen.getByRole('link', { name: /example source/i });
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has correct styling classes', () => {
    render(<SourcedLink source={testSource} />);
    const linkElement = screen.getByRole('link', { name: /example source/i });
    // Check for classes that were added for styling
    expect(linkElement).toHaveClass('text-xs');
    expect(linkElement).toHaveClass('text-accent');
    expect(linkElement).toHaveClass('hover:text-accent-foreground');
    expect(linkElement).toHaveClass('flex');
    expect(linkElement).toHaveClass('items-center');
    expect(linkElement).toHaveClass('mt-1');
  });

  it('renders the Link icon', () => {
    render(<SourcedLink source={testSource} />);
    const linkElement = screen.getByRole('link', { name: /example source/i });
    expect(linkElement.querySelector('svg')).toBeInTheDocument();
  });
});
