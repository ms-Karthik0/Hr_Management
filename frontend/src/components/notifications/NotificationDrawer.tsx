import React from 'react';
import { NotificationItem } from '../../types';
import {
  X,
  Bell,
  CheckCheck,
  CalendarCheck,
  CreditCard,
  Award,
  BrainCircuit,
  Info
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'LEAVE': return <CalendarCheck className="h-4 w-4 text-emerald-500" />;
      case 'PAYROLL': return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'PERFORMANCE': return <Award className="h-4 w-4 text-amber-500" />;
      case 'AI_ALERT': return <BrainCircuit className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-sm border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-right duration-200 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">Enterprise Alerts & Notifications</h3>
            </div>
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>F-07 Multi-channel Delivery (Email/SMS/WebSocket)</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">95% Delivery Rate</span>
          </div>

          <div className="mt-4 space-y-3 overflow-y-auto max-h-[75vh] pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`cursor-pointer rounded-xl border p-3.5 text-xs transition-all ${
                  n.isRead
                    ? 'border-slate-100 bg-slate-50/50 dark:border-slate-800/60 dark:bg-slate-800/20'
                    : 'border-indigo-100 bg-indigo-50/40 dark:border-indigo-950 dark:bg-indigo-950/20 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => notifications.forEach(n => onMarkRead(n.id))}
            className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400 flex items-center justify-center gap-1.5 w-full"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All Notifications as Read</span>
          </button>
        </div>
      </div>
    </div>
  );
};
