import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Attendance, Employee } from '../../types';
import { api } from '../../services/api';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Users,
  Calendar,
  Sparkles,
  LogIn,
  LogOut,
  RefreshCw
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { user } = useAuth();
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Attendance['status']>('PRESENT');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [att, emps] = await Promise.all([
        api.getTodayAttendance(),
        api.getEmployees()
      ]);
      setAttendanceList(att);
      setEmployees(emps);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async (employeeId: number) => {
    setActionLoading(true);
    try {
      await api.punchIn(employeeId, selectedStatus, notes || 'Contactless biometric gate verification');
      setNotes('');
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const handlePunchOut = async (employeeId: number) => {
    setActionLoading(true);
    try {
      await api.punchOut(employeeId);
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateAll = async () => {
    setActionLoading(true);
    try {
      await api.simulateBiometrics();
      await loadData();
    } finally {
      setActionLoading(false);
    }
  };

  const myAttendance = attendanceList.find(a => a.employee.id === (user?.employeeId || 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Biometric Attendance Tracking & Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            F-02: RFID simulation, real-time clock-in/out, and shift duration computation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateAll}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors shadow-xs"
          >
            <Sparkles className="h-4 w-4" />
            <span>Simulate Enterprise Fleet Punches</span>
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-xs"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Punch Terminal Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Biometric Scanner Console</h3>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Simulate live optical/RFID biometric authentication
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clock Mode</label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {(['PRESENT', 'REMOTE', 'LATE'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSelectedStatus(mode)}
                    className={`rounded-xl py-2 text-xs font-bold transition-all ${
                      selectedStatus === mode
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Verification Note</label>
              <input
                type="text"
                placeholder="e.g. San Francisco HQ Gate 2"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handlePunchIn(user?.employeeId || 1)}
                disabled={actionLoading || (myAttendance && !myAttendance.punchOut)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                <span>Clock In</span>
              </button>

              <button
                onClick={() => handlePunchOut(user?.employeeId || 1)}
                disabled={actionLoading || !myAttendance || !!myAttendance.punchOut}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-700 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Clock Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Attendance Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">Today&apos;s Biometric Summary</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800/60">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{attendanceList.length}</div>
              <div className="mt-1 text-xs text-slate-500">Punches Logged</div>
            </div>
            <div className="rounded-xl bg-emerald-50/60 p-4 text-center dark:bg-emerald-950/30">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {attendanceList.filter(a => a.status === 'PRESENT').length}
              </div>
              <div className="mt-1 text-xs text-slate-500">Present (On-Time)</div>
            </div>
            <div className="rounded-xl bg-blue-50/60 p-4 text-center dark:bg-blue-950/30">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {attendanceList.filter(a => a.status === 'REMOTE').length}
              </div>
              <div className="mt-1 text-xs text-slate-500">Remote Check-In</div>
            </div>
            <div className="rounded-xl bg-amber-50/60 p-4 text-center dark:bg-amber-950/30">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {attendanceList.filter(a => a.status === 'LATE').length}
              </div>
              <div className="mt-1 text-xs text-slate-500">Late Punches</div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Real-Time Verification Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-semibold">Employee</th>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Punch In</th>
                <th className="px-6 py-3 font-semibold">Punch Out</th>
                <th className="px-6 py-3 font-semibold">Total Hours</th>
                <th className="px-6 py-3 font-semibold">Biometric Status</th>
                <th className="px-6 py-3 font-semibold">Verification Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {attendanceList.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                    {att.employee.firstName} {att.employee.lastName}
                    <span className="block text-[11px] font-normal text-slate-400">{att.employee.employeeCode}</span>
                  </td>
                  <td className="px-6 py-3.5">{att.employee.departmentName}</td>
                  <td className="px-6 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {att.punchIn || '--:--'}
                  </td>
                  <td className="px-6 py-3.5 font-mono">
                    {att.punchOut || (
                      <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        In Shift
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 font-semibold">
                    {att.totalHours ? `${att.totalHours} hrs` : '--'}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        att.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : att.status === 'REMOTE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{att.notes || 'RFID Gate'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
