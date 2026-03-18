import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { LayoutDashboard, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Button } from './components/atoms';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const TEXT = {
  APP_TITLE: 'OTC Flow',
  LOGOUT_TITLE: 'Logout',
  FOOTER: 'OTC Trade Capture MVP • Built with FastAPI & React Query',
};

function AppLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight uppercase">{TEXT.APP_TITLE}</span>
            </Link>

            <div className="flex items-center gap-6">
              {isAuthenticated && user && (
                <div className="flex items-center gap-4 border-l border-zinc-100 pl-6">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">{user.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      {user.role === 'manager' ? (
                        <ShieldCheck className="w-3 h-3 text-indigo-500" />
                      ) : (
                        <UserIcon className="w-3 h-3 text-zinc-400" />
                      )}
                      {user.role}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={TEXT.LOGOUT_TITLE}
                    onClick={logout}
                    className="text-zinc-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{TEXT.FOOTER}</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
