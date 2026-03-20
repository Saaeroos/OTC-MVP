import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Login } from '../components/molecules';
import { LayoutDashboard } from 'lucide-react';

const TEXT = {
  TITLE: 'OTC Flow',
  SUBTITLE: 'Please select a role to begin.',
  FOOTER: 'OTC Trade Capture MVP',
};

export const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">
              {TEXT.TITLE}
            </h1>
            <p className="text-zinc-500 font-medium">{TEXT.SUBTITLE}</p>
          </div>
        </div>

        <div className="mt-8">
          <Login />
        </div>

        <div className="pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{TEXT.FOOTER}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
