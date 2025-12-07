import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WelcomeScreen } from './WelcomeScreen';
import { vi } from 'vitest';

// Mock shadcn/ui Select component for isolated testing of WelcomeScreen logic
// This mock simplifies the Select component to make it testable with testing-library
vi.mock('@/components/ui/select', async () => {
  const React = await vi.importActual('react'); // Import React inside the factory
  const { useState, useEffect } = React; // Destructure hooks

  const MockSelectTrigger = React.forwardRef(({ children, id, className, ...props }: any, ref) => (
    <button
      ref={ref}
      id={id}
      data-testid="select-trigger-mock"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={props['aria-expanded'] || false} // Add aria-expanded
      className={className}
      {...props}
    >
      {children}
    </button>
  ));
  MockSelectTrigger.displayName = 'SelectTrigger';

  const MockSelectContent = ({ children }: any) => (
    <div data-testid="select-content-mock" role="listbox">
      {children}
    </div>
  );
  MockSelectContent.displayName = 'SelectContent';

  const MockSelectItem = React.forwardRef(({ children, value, onClick, ...props }: any, ref) => (
    <button
      ref={ref}
      role="option"
      aria-selected={props['aria-selected']}
      data-testid={`select-item-mock-${value}`}
      onClick={onClick}
      value={value}
      {...props}
    >
      {children}
    </button>
  ));
  MockSelectItem.displayName = 'SelectItem';


  return {
    Select: ({ children, onValueChange, defaultValue, value, ...props }: any) => {
      const [mockValue, setMockValue] = useState(defaultValue || value || '');

      // Simulate onValueChange when the internal mockValue changes
      useEffect(() => {
        if (onValueChange) {
          onValueChange(mockValue);
        }
      }, [mockValue, onValueChange]);

      // Render the children, intercepting SelectTrigger and SelectContent to inject mock logic
      return (
        <div data-testid="mock-select-root" {...props}>
          {React.Children.map(children, child => {
            if (child && child.type && child.type.displayName === 'SelectTrigger') {
              return React.cloneElement(child, {
                onClick: () => { /* simulate dropdown open */ },
                'aria-expanded': true, // Assume it opens on click for interaction
                'aria-controls': child.props.id + '-listbox',
                // How to pass the current value for display? SelectValue is nested.
              });
            }
            if (child && child.type && child.type.displayName === 'SelectContent') {
              return React.cloneElement(child, {
                children: React.Children.map(child.props.children, item => {
                  if (item && item.type && item.type.displayName === 'SelectItem') {
                    return React.cloneElement(item, {
                      onClick: () => {
                        setMockValue(item.props.value);
                        // No need to call onValueChange here, useEffect will handle it
                      },
                      'aria-selected': mockValue === item.props.value, // Simulate selection
                    });
                  }
                  return item;
                })
              });
            }
            return child;
          })}
        </div>
      );
    },
    SelectTrigger: MockSelectTrigger,
    SelectValue: ({ placeholder, ...props }: any) => (
      <span {...props}>{placeholder || 'Mocked Value'}</span>
    ),
    SelectContent: MockSelectContent,
    SelectItem: MockSelectItem,
    // Add mocks for other parts of the Select component if they are used
    SelectGroup: ({ children }: any) => <div role="group">{children}</div>,
    SelectLabel: ({ children }: any) => <span>{children}</span>,
    SelectSeparator: () => <hr />,
    SelectScrollUpButton: () => null,
    SelectScrollDownButton: () => null,
  };
});

// Mock shadcn/ui Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock shadcn/ui Card components if they don't impact logic being tested
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h2 data-testid="card-title">{children}</h2>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

describe('WelcomeScreen', () => {
  const mockOnStartChat = vi.fn();

  beforeEach(() => {
    mockOnStartChat.mockClear();
  });

  it('renders correctly with initial elements', () => {
    render(<WelcomeScreen onStartChat={mockOnStartChat} />);

    expect(screen.getByRole('heading', { name: /Welcome to Sentiabot!/i })).toBeInTheDocument();
    // Use getByRole('combobox') for select triggers
    expect(screen.getByRole('combobox', { name: /Subject/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Grade Level/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Chatting/i })).toBeInTheDocument();
  });

  it('Start Chatting button is initially disabled', () => {
    render(<WelcomeScreen onStartChat={mockOnStartChat} />);
    const startChatButton = screen.getByRole('button', { name: /Start Chatting/i });
    expect(startChatButton).toBeDisabled();
  });

  it('Start Chatting button becomes enabled after selecting subject and grade', async () => {
    render(<WelcomeScreen onStartChat={mockOnStartChat} />);
    const startChatButton = screen.getByRole('button', { name: /Start Chatting/i });
    const subjectCombobox = screen.getByRole('combobox', { name: /Subject/i });
    const gradeCombobox = screen.getByRole('combobox', { name: /Grade Level/i });

    expect(startChatButton).toBeDisabled();

    // Simulate selecting a subject
    fireEvent.click(subjectCombobox); // Open the select
    fireEvent.click(screen.getByRole('option', { name: 'Biology' })); // Select an option

    expect(startChatButton).toBeDisabled(); // Should still be disabled until grade is selected

    // Simulate selecting a grade
    fireEvent.click(gradeCombobox); // Open the select
    fireEvent.click(screen.getByRole('option', { name: 'Grade 1' })); // Select an option

    await waitFor(() => {
      expect(startChatButton).toBeEnabled();
    });
  });

  it('calls onStartChat when the enabled button is clicked', async () => {
    render(<WelcomeScreen onStartChat={mockOnStartChat} />);
    const startChatButton = screen.getByRole('button', { name: /Start Chatting/i });
    const subjectCombobox = screen.getByRole('combobox', { name: /Subject/i });
    const gradeCombobox = screen.getByRole('combobox', { name: /Grade Level/i });

    fireEvent.click(subjectCombobox);
    fireEvent.click(screen.getByRole('option', { name: 'Geology' }));

    fireEvent.click(gradeCombobox);
    fireEvent.click(screen.getByRole('option', { name: 'Grade 6' }));

    await waitFor(() => {
      expect(startChatButton).toBeEnabled();
    });

    fireEvent.click(startChatButton);
    expect(mockOnStartChat).toHaveBeenCalledTimes(1);
  });

  it('displays correct subject options', () => {
    render(<WelcomeScreen onStartChat={mockOnStartChat} />);
    const subjectCombobox = screen.getByRole('combobox', { name: /Subject/i });

    fireEvent.click(subjectCombobox); // Open the select to see options

    expect(screen.getByRole('option', { name: 'Biology' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Geology' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Science' })).not.toBeInTheDocument();
  });

  it('displays correct grade level options', () => {
    render(<WelcomeScreen onStartChat={mockOnStartChat} />);
    const gradeCombobox = screen.getByRole('combobox', { name: /Grade Level/i });

    fireEvent.click(gradeCombobox); // Open the select to see options

    for (let i = 1; i <= 7; i++) {
      expect(screen.getByRole('option', { name: `Grade ${i}` })).toBeInTheDocument();
    }
    expect(screen.queryByRole('option', { name: 'Grade 8' })).not.toBeInTheDocument();
  });
});
