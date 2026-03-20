import React from 'react';
import { useAuth } from '../../hooks/queries/useAuth';
import { UserCircle2 } from 'lucide-react';

const TEXT = {
  LABEL: 'Switch Simulated Role',
  PLACEHOLDERS: 'Select a role...',
  LOADING: 'Loading roles...',
};

export const Login: React.FC = () => {
  const { users, isLoadingUsers, login, isLoggingIn } = useAuth();

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    if (username) {
      login(username);
    }
  };

  if (isLoadingUsers) return <div className="animate-pulse">{TEXT.LOADING}</div>;

  return (
    <div className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg shadow-sm">
      <UserCircle2 className="w-5 h-5 text-zinc-500" />
      <div className="flex-1">
        <label htmlFor="role-select" className="block text-xs font-medium text-zinc-500 mb-1">
          {TEXT.LABEL}
        </label>
        <select
          id="role-select"
          className="w-full bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
          onChange={handleUserChange}
          defaultValue=""
        >
          <option value="" disabled>
            {TEXT.PLACEHOLDERS}
          </option>
          {users?.map((user) => (
            <option key={user.id} value={user.username}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>
      {isLoggingIn && (
        <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
      )}
    </div>
  );
};
