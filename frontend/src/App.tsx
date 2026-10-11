import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { LeaveManagement } from './components/leaves/LeaveManagement';
import { PayrollModule } from './components/payroll/PayrollModule';
import { PerformanceAppraisals } from './components/performance/PerformanceAppraisals';
import { AiWorkforceIntelligence } from './components/ai/AiWorkforceIntelligence';
import { AuditAndCompliance } from './components/security/AuditAndCompliance';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { NotificationItem } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const list = await api.getNotifications();
    setNotifications(list);
  };

  const handleMarkRead = async (id: number) => {
    await api.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadCount={unreadCount}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'dashboard' && <OverviewDashboard onNavigateTab={setActiveTab} />}
            {activeTab === 'employees' && <EmployeeDirectory />}
            {activeTab === 'attendance' && <AttendanceModule />}
            {activeTab === 'leaves' && <LeaveManagement />}
            {activeTab === 'payroll' && <PayrollModule />}
            {activeTab === 'performance' && <PerformanceAppraisals />}
            {activeTab === 'ai-insights' && <AiWorkforceIntelligence />}
            {activeTab === 'security' && <AuditAndCompliance />}
          </div>
        </main>
      </div>

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
