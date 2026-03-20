import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from './Login';
import { useAuth } from '../../hooks/queries/useAuth';

vi.mock('../../hooks/queries/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Login Molecule', () => {
  it('shows loading state correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      users: [],
      isLoadingUsers: true,
      login: vi.fn(),
      isLoggingIn: false,
    } as unknown as ReturnType<typeof useAuth>);

    render(<Login />);
    expect(screen.getByText(/Loading roles.../i)).toBeInTheDocument();
  });

  it('renders user options correctly', () => {
    const mockUsers = [
      { id: '1', username: 'trader1', name: 'Trader One', role: 'trader' },
      { id: '2', username: 'manager1', name: 'Manager One', role: 'manager' },
    ];

    vi.mocked(useAuth).mockReturnValue({
      users: mockUsers,
      isLoadingUsers: false,
      login: vi.fn(),
      isLoggingIn: false,
    } as unknown as ReturnType<typeof useAuth>);

    render(<Login />);

    expect(screen.getByText('Trader One (trader)')).toBeInTheDocument();
    expect(screen.getByText('Manager One (manager)')).toBeInTheDocument();
  });

  it('calls login when a role is selected', () => {
    const mockLogin = vi.fn();
    const mockUsers = [{ id: '1', username: 'trader1', name: 'Trader One', role: 'trader' }];

    vi.mocked(useAuth).mockReturnValue({
      users: mockUsers,
      isLoadingUsers: false,
      login: mockLogin,
      isLoggingIn: false,
    } as unknown as ReturnType<typeof useAuth>);

    render(<Login />);

    const select = screen.getByLabelText(/Switch Simulated Role/i);
    fireEvent.change(select, { target: { value: 'trader1' } });

    expect(mockLogin).toHaveBeenCalledWith('trader1');
  });
});
