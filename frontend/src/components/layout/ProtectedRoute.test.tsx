import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../../stores/authStore';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Helpers to verify routing destination
const AuthPageMock = () => <div>Auth Page Content</div>;
const ProtectedContent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (initialRoute = '/protected') => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/auth" element={<AuthPageMock />} />
          <Route 
            path="/protected" 
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders children when the user is authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
    } as any);

    renderWithRouter();
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Auth Page Content')).not.toBeInTheDocument();
  });

  it('redirects to /auth when the user is not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
    } as any);

    renderWithRouter();
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Auth Page Content')).toBeInTheDocument();
  });
});
