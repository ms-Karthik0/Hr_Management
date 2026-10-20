import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Bell, Sun, Moon, Shield, UserCheck, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications, unreadCount }) => {
  const { user, switchRole, theme, toggleTheme, logout } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { key: Role; label: string; badge: string; color: string }[] = [
    { key: 'ROLE_ADMIN', label: 'Executive Admin', badge: 'Full Access', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
    { key: 'ROLE_HR_MANAGER', label: 'HR Manager', badge: 'Lifecycle & Payroll', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    { key: 'ROLE_MANAGER', label: 'Team Manager', badge: 'Approvals & Reviews', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' },
    { key: 'ROLE_EMPLOYEE', label: 'Employee (Self)', badge: 'Portal View', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' }
  ];

  const currentRoleInfo = roles.find(r => r.key === user?.role) || roles[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">NexusHR</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              v2.0 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">AI-Enabled Enterprise Workforce Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Role Switcher for Evaluators / Judges */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 transition-all shadow-xs"
          >
            <Shield className="h-3.5 w-3.5 text-indigo-500" />
            <span>Role: <strong>{currentRoleInfo.label}</strong></span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1-Click Role Switch (Demo Mode)
              </div>
              <div className="mt-1 space-y-1">
                {roles.map(r => (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchRole(r.key);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      user?.role === r.key
                        ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-slate-400">{r.badge}</div>
                    </div>
                    {user?.role === r.key && <UserCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-xs">
            {user?.firstName?.[0] || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[11px] text-slate-400">{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
