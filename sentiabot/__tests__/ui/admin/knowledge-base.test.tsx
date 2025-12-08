import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KnowledgeBaseManagementPage from '@/app/admin/knowledge-base/page';

// Mock problematic imports
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h2 data-testid="card-title">{children}</h2>,
  CardDescription: ({ children }: any) => <p data-testid="card-description">{children}</p>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table data-testid="table">{children}</table>,
  TableHeader: ({ children }: any) => <thead data-testid="table-header">{children}</thead>,
  TableRow: ({ children }: any) => <tr data-testid="table-row">{children}</tr>,
  TableHead: ({ children }: any) => <th data-testid="table-head">{children}</th>,
  TableBody: ({ children }: any) => <tbody data-testid="table-body">{children}</tbody>,
  TableCell: ({ children }: any) => <td data-testid="table-cell">{children}</td>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: any) => <div data-testid="alert-dialog">{children}</div>,
  AlertDialogTrigger: ({ children }: any) => <div data-testid="alert-dialog-trigger">{children}</div>,
  AlertDialogContent: ({ children }: any) => <div data-testid="alert-dialog-content">{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div data-testid="alert-dialog-header">{children}</div>,
  AlertDialogTitle: ({ children }: any) => <h3 data-testid="alert-dialog-title">{children}</h3>,
  AlertDialogDescription: ({ children }: any) => <p data-testid="alert-dialog-description">{children}</p>,
  AlertDialogFooter: ({ children }: any) => <div data-testid="alert-dialog-footer">{children}</div>,
  AlertDialogCancel: ({ children }: any) => <button data-testid="alert-dialog-cancel">{children}</button>,
  AlertDialogAction: ({ children, ...props }: any) => <button {...props} data-testid="alert-dialog-action">{children}</button>,
}));

vi.mock('@/components/knowledge-base-entry-form', () => ({
  KnowledgeBaseEntryForm: ({ onSave, initialData, isEditMode, children }: any) => (
    <div data-testid="knowledge-base-entry-form">
      <button onClick={() => onSave({ title: 'Mocked New', content: 'Mocked Content', source_url: 'http://mocked.com' })}>
        {isEditMode ? 'Edit' : 'Create New Document'}
      </button>
      {children}
    </div>
  ),
}));


// Mock the fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      message: 'simulated success',
      entry: { id: 99, title: 'New Entry', content: 'New Content', source_url: 'https://new.com' }
    }),
  })
) as any;

describe('KnowledgeBaseManagementPage', () => {
  it('should display "Access Denied" if not authenticated', () => {
    // Temporarily override isAdminAuthenticated for this test
    const originalIsAdminAuthenticated = (KnowledgeBaseManagementPage as any).isAdminAuthenticated;
    (KnowledgeBaseManagementPage as any).isAdminAuthenticated = false;

    render(<KnowledgeBaseManagementPage />);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('You must be logged in as an administrator to view this page.')).toBeInTheDocument();

    // Restore original value
    (KnowledgeBaseManagementPage as any).isAdminAuthenticated = originalIsAdminAuthenticated;
  });

  it('should render the knowledge base management page if authenticated', async () => {
    render(<KnowledgeBaseManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Knowledge Base Management')).toBeInTheDocument();
      expect(screen.getByText('Manage your knowledge base documents.')).toBeInTheDocument();
      expect(screen.getByText('What is Photosynthesis?')).toBeInTheDocument();
    });
  });

  it('should open the create new document form', async () => {
    render(<KnowledgeBaseManagementPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Create New Document' }));
    });
    expect(screen.getByText('Create New Knowledge Base Entry')).toBeInTheDocument();
  });

  it('should create a new knowledge base entry', async () => {
    render(<KnowledgeBaseManagementPage />);

    // Open form
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Create New Document' }));
    });

    // Fill form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test New Doc' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'This is new content.' } });
    fireEvent.change(screen.getByLabelText('Source URL'), { target: { value: 'https://testnew.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Create Document' }));

    // Expect fetch to be called and new entry to appear
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/knowledge-base', expect.any(Object));
      expect(screen.getByText('Test New Doc')).toBeInTheDocument();
    });
  });

  it('should open the edit document form', async () => {
    render(<KnowledgeBaseManagementPage />);
    await waitFor(() => {
      // Find the first 'Edit' button
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });
      fireEvent.click(editButtons[0]);
    });
    expect(screen.getByText('Edit Knowledge Base Entry')).toBeInTheDocument();
    expect(screen.getByDisplayValue('What is Photosynthesis?')).toBeInTheDocument();
  });

  it('should edit an existing knowledge base entry', async () => {
    render(<KnowledgeBaseManagementPage />);

    // Open form
    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });
      fireEvent.click(editButtons[0]);
    });

    // Fill form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Photosynthesis' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    // Expect fetch to be called and updated entry to appear
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/knowledge-base', expect.any(Object));
      expect(screen.getByText('Updated Photosynthesis')).toBeInTheDocument();
    });
  });

  it('should delete a knowledge base entry', async () => {
    render(<KnowledgeBaseManagementPage />);

    // Open delete confirmation
    await waitFor(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    });

    expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument();

    // Confirm deletion
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    // Expect fetch to be called and entry to be removed
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/knowledge-base?id=1', expect.any(Object));
      expect(screen.queryByText('What is Photosynthesis?')).not.toBeInTheDocument();
    });
  });
});
