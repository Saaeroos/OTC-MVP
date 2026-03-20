import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../atoms';

const TEXT = {
  APP_TITLE: 'OTC Flow',
  LOGOUT_TITLE: 'Logout',
};

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
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
  );
}
