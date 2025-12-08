import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WelcomeScreen } from './WelcomeScreen';
import { vi, beforeEach } from 'vitest';
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as ButtonActual from '@/components/ui/button';
import * as CardActual from '@/components/ui/card';

type Mock = ReturnType<typeof vi.fn>;

// Mock shadcn/ui Select component for isolated testing of WelcomeScreen logic
vi.mock('@/components/ui/select', async () => {
  const ReactImported = await vi.importActual<typeof React>('react'); // Assert type here
  const { useState, useEffect } = ReactImported;

  type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger>;
  const MockSelectTrigger = ReactImported.forwardRef(({ children, id, className, ...props }: SelectTriggerProps, ref: React.ForwardedRef<HTMLButtonElement | HTMLDivElement>) => (
    <button
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      id={id}
      data-testid="select-trigger-mock"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={props['aria-expanded']}
      aria-controls={id ? `${id}-listbox` : undefined}
      className={className}
      {...props}
    >
      {children}
    </button>
  ));
  MockSelectTrigger.displayName = 'SelectTrigger';

  type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content>;
  const MockSelectContent = ({ children, ...props }: SelectContentProps) => (
    <div data-testid="select-content-mock" role="listbox" {...props}>
      {children}
    </div>
  );
  MockSelectContent.displayName = 'SelectContent';

  type SelectItemProps = Omit<React.ComponentProps<typeof SelectPrimitive.Item>, 'ref'> & { onClick?: (event: React.MouseEvent) => void; ref?: React.Ref<HTMLButtonElement>; "data-testid"?: string; };
  const MockSelectItem = ReactImported.forwardRef(({ children, value, onClick, ...props }: SelectItemProps, ref: React.Ref<HTMLButtonElement>) => {
    return (
      <button
        ref={ref}
        role="option"
        aria-selected={props["aria-selected"]}
        data-testid={props["data-testid"] || `select-item-mock-${value}`}
        onClick={onClick}
        value={value}
        {...(props as any)} // Cast props to any to bypass type checking for the spread
      >
        {children}
      </button>
    );
  });
  MockSelectItem.displayName = 'SelectItem';

  type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & { onValueChange?: (value: string) => void; defaultValue?: string; value?: string; };
  return {
    Select: ({ children, onValueChange, defaultValue, value, ...props }: SelectProps) => {
      const [mockValue, setMockValue] = useState(defaultValue || value || '');

      useEffect(() => {
        if (onValueChange) {
          onValueChange(mockValue);
        }
      }, [mockValue, onValueChange]);

      return (
        <div data-testid="mock-select-root" {...props}>
          {ReactImported.Children.toArray(children).filter(ReactImported.isValidElement).map((child: React.ReactElement) => {
            const childType = child.type as React.ComponentType & { displayName?: string };
            const childProps = child.props as SelectTriggerProps | SelectContentProps; // Cast child.props
            if (child && ReactImported.isValidElement(child) && childType.displayName === 'SelectTrigger') {
              return ReactImported.cloneElement(child, {
                onClick: () => { /* simulate dropdown open */ },
                'aria-expanded': true,
                'aria-controls': (childProps as SelectTriggerProps).id ? `${(childProps as SelectTriggerProps).id}-listbox` : undefined,
              } as SelectTriggerProps);
            }
            if (child && ReactImported.isValidElement(child) && childType.displayName === 'SelectContent') {
              return ReactImported.cloneElement(child, {
                children: ReactImported.Children.toArray(childProps.children).filter(ReactImported.isValidElement).map((item: React.ReactElement) => {
                  const itemType = item.type as React.ComponentType & { displayName?: string };
                  const itemProps = item.props as SelectItemProps; // Cast item.props
                  if (item && ReactImported.isValidElement(item) && itemType.displayName === 'SelectItem') {
                    return ReactImported.cloneElement(item, {
                      onClick: () => {
                        setMockValue((itemProps as {value: string}).value);
                      },
                      'aria-selected': mockValue === (itemProps as {value: string}).value,
                      value: (itemProps as {value: string}).value, // Explicitly pass value
                    } as SelectItemProps);
                  }
                  return item;
                })
              } as SelectContentProps);
            }
            return child;
          })}
        </div>
      );
    },
    SelectTrigger: MockSelectTrigger,
    SelectValue: ({ placeholder, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) => (
      <span {...props}>{placeholder || 'Mocked Value'}</span>
    ),
    SelectContent: MockSelectContent,
    SelectItem: MockSelectItem,
    SelectGroup: ({ children, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) => <div role="group" {...props}>{children}</div>,
    SelectLabel: ({ children, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) => <span {...props}>{children}</span>,
    SelectSeparator: () => <hr />,
    SelectScrollUpButton: () => null,
    SelectScrollDownButton: () => null,
  };
});

// Mock shadcn/ui Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: React.ComponentProps<typeof ButtonActual.Button>) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock shadcn/ui Card components if they don't impact logic being tested
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: React.ComponentProps<typeof CardActual.Card>) => <div data-testid="card" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: React.ComponentProps<typeof CardActual.CardHeader>) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: React.ComponentProps<typeof CardActual.CardTitle>) => <h2 data-testid="card-title" {...props}>{children}</h2>,
  CardContent: ({ children, ...props }: React.ComponentProps<typeof CardActual.CardContent>) => <div data-testid="card-content" {...props}>{children}</div>,
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