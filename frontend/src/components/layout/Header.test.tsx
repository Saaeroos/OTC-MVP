import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import { useAuthStore } from '../../stores/authStore';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Header', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };

  it('renders app title correctly', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
    } as any);

    renderHeader();
    expect(screen.getByText('OTC Flow')).toBeInTheDocument();
  });

  it('does not render user info or logout button when unauthenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
    } as any);

    renderHeader();
    expect(screen.queryByTitle('Logout')).not.toBeInTheDocument();
  });

  it('renders user info and logout button when authenticated as a standard user', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { name: 'John Doe', role: 'trader' },
      isAuthenticated: true,
      logout: mockLogout,
    } as any);

    renderHeader();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('trader')).toBeInTheDocument();
    expect(screen.getByTitle('Logout')).toBeInTheDocument();
  });

  it('renders user info correctly when authenticated as a manager', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { name: 'Jane Manager', role: 'manager' },
      isAuthenticated: true,
      logout: mockLogout,
    } as any);

    renderHeader();
    expect(screen.getByText('Jane Manager')).toBeInTheDocument();
    expect(screen.getByText('manager')).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { name: 'John Doe', role: 'trader' },
      isAuthenticated: true,
      logout: mockLogout,
    } as any);

    renderHeader();
    
    const logoutBtn = screen.getByTitle('Logout');
    fireEvent.click(logoutBtn);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
