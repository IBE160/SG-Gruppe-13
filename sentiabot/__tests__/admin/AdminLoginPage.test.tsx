import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdminLoginPage from '../../src/app/admin/login/page';
import { useRouter, useSearchParams } from 'next/navigation';

type Mock = ReturnType<typeof vi.fn>; // Define Mock type

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
}));

describe('AdminLoginPage', () => {
  let mockPush: Mock;
  let mockGetSearchParams: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush = vi.fn();
    mockGetSearchParams = vi.fn(() => null); // Default no query error
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as Mock).mockReturnValue({ get: mockGetSearchParams });

    // Mock the global fetch function
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the admin login form', () => {
    render(<AdminLoginPage />);

    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('displays error from query params on initial load', () => {
    mockGetSearchParams.mockReturnValue('Some query error');
    render(<AdminLoginPage />);
    expect(screen.getByText('Some query error')).toBeInTheDocument();
  });

  it('should attempt to sign in on form submission', async () => {
    const user = userEvent.setup();
    (global.fetch as Mock).mockResolvedValue({
      redirected: true,
      url: 'http://localhost/admin/dashboard',
    });

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object));
    const callArgs = (global.fetch as Mock).mock.calls[0][1];
    expect(callArgs.method).toBe('POST');
    // Further checks on formData if needed, but fetch call itself indicates submission.
  });

  it('should navigate to /admin/dashboard on successful login (API route handles redirect)', async () => {
    const user = userEvent.setup();
    (global.fetch as Mock).mockResolvedValue({
      redirected: true,
      url: 'http://localhost/admin/dashboard',
    });

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'adminpassword');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    // No direct router.push here, as fetch with redirect: 'follow' will trigger actual navigation
    // We expect fetch to be called, and the browser to handle the redirect.
    // This test primarily checks that fetch was called correctly and would result in a redirect.
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object));
  });

  it('should display error message on failed login response from API', async () => {
    const user = userEvent.setup();
    (global.fetch as Mock).mockResolvedValue({
      redirected: false,
      text: () => Promise.resolve('Invalid credentials'),
    });

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Email'), 'wrong@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should display generic error message on network failure', async () => {
    const user = userEvent.setup();
    (global.fetch as Mock).mockRejectedValue(new Error('Network down'));

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText('Email'), 'any@example.com');
    await user.type(screen.getByLabelText('Password'), 'anypassword');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Network error or unable to connect to the server.')).toBeInTheDocument();
    });
  });
});