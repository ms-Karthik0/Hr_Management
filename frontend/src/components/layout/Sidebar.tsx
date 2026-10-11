import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Award,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'payroll'
  | 'performance'
  | 'ai-insights'
  | 'security';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const navigation = [
    { id: 'dashboard' as TabType, label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { id: 'employees' as TabType, label: 'Employee Lifecycle', icon: Users, badge: '', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_MANAGER'] },
    { id: 'attendance' as TabType, label: 'Biometric Attendance', icon: Clock, badge: 'Today', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { id: 'leaves' as TabType, label: 'Leave & Approvals', icon: CalendarCheck, badge: 'Workflow', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { id: 'payroll' as TabType, label: 'Payroll & Payslips', icon: CreditCard, badge: 'Auto', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_EMPLOYEE'] },
    { id: 'performance' as TabType, label: 'Performance 360', icon: Award, badge: 'Q1', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { id: 'ai-insights' as TabType, label: 'AI Workforce Intelligence', icon: BrainCircuit, badge: 'AI >88%', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_MANAGER'] },
    { id: 'security' as TabType, label: 'OWASP & Audit Logs', icon: ShieldCheck, badge: 'Compliance', roles: ['ROLE_ADMIN', 'ROLE_HR_MANAGER'] }
  ];

  const visibleNav = navigation.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className="w-64 border-r border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 flex flex-col justify-between shrink-0 transition-colors">
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Workforce Navigation
          </p>
          <nav className="mt-2 space-y-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 p-3.5 dark:border-indigo-950/60 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <BrainCircuit className="h-4 w-4" />
          <span className="text-xs font-bold">Spring AI Core 2026</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Predictive attrition model & skill gap analysis operational.
        </p>
      </div>
    </aside>
  );
};
