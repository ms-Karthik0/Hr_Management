import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LeaveRequest } from '../../types';
import { api } from '../../services/api';
import {
  CalendarCheck,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  X,
  UserCheck
} from 'lucide-react';

export const LeaveManagement: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [reviewModalLeave, setReviewModalLeave] = useState<LeaveRequest | null>(null);
  const [reviewerComment, setReviewerComment] = useState('');

  // Form
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('PAID');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const isApprover = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR_MANAGER' || user?.role === 'ROLE_MANAGER';

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaves();
      setLeaves(data);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.applyLeave({
        employeeId: user?.employeeId || 1,
        leaveType,
        startDate,
        endDate,
        reason
      });
      setShowApplyModal(false);
      setReason('');
      await loadLeaves();
    } catch (err: any) {
      alert(err.message || 'Failed to apply leave');
    }
  };

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!reviewModalLeave) return;
    try {
      await api.reviewLeave(reviewModalLeave.id, status, reviewerComment, `${user?.firstName} ${user?.lastName}`);
      setReviewModalLeave(null);
      setReviewerComment('');
      await loadLeaves();
    } catch (err: any) {
      alert(err.message || 'Failed to review leave');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leave & Absence Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            F-02: Leave balances, request submissions, and manager approval workflows
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Paid Annual Leave</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">18</span>
            <span className="text-xs text-slate-400">/ 24 days remaining</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Accrues 2 days per month</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Casual Leave</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">10</span>
            <span className="text-xs text-slate-400">/ 12 days remaining</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Short-notice emergency leave</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Medical / Sick Leave</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">12</span>
            <span className="text-xs text-slate-400">/ 14 days remaining</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Requires medical document &gt; 3 days</div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Leave Requests & Approvals Queue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-semibold">Employee</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Duration</th>
                <th className="px-6 py-3 font-semibold">Days</th>
                <th className="px-6 py-3 font-semibold">Reason</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Reviewer</th>
                {isApprover && <th className="px-6 py-3 font-semibold text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                    {leave.employee.firstName} {leave.employee.lastName}
                    <span className="block text-[11px] font-normal text-slate-400">{leave.employee.departmentName}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{leave.leaveType}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    {leave.startDate} to {leave.endDate}
                  </td>
                  <td className="px-6 py-3.5 font-semibold">{leave.daysCount} days</td>
                  <td className="px-6 py-3.5 max-w-xs truncate text-slate-500 dark:text-slate-400">
                    {leave.reason}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        leave.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : leave.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {leave.status === 'APPROVED' && <CheckCircle className="h-3 w-3" />}
                      {leave.status === 'PENDING' && <Clock className="h-3 w-3" />}
                      {leave.status === 'REJECTED' && <XCircle className="h-3 w-3" />}
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">
                    {leave.approvedBy || 'Pending Review'}
                  </td>
                  {isApprover && (
                    <td className="px-6 py-3.5 text-right">
                      {leave.status === 'PENDING' ? (
                        <button
                          onClick={() => setReviewModalLeave(leave)}
                          className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                        >
                          Review &rarr;
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Decided</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply for Leave</h3>
              <button onClick={() => setShowApplyModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveRequest['leaveType'])}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="PAID">Paid Annual Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Medical / Sick Leave</option>
                  <option value="MATERNITY">Maternity / Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reason / Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context for coverage..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review Leave Application</h3>
              <button onClick={() => setReviewModalLeave(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60 space-y-2">
              <div>
                <span className="text-slate-400">Applicant:</span>{' '}
                <strong>{reviewModalLeave.employee.firstName} {reviewModalLeave.employee.lastName}</strong>
              </div>
              <div>
                <span className="text-slate-400">Duration:</span>{' '}
                <strong>{reviewModalLeave.startDate}</strong> to <strong>{reviewModalLeave.endDate}</strong> ({reviewModalLeave.daysCount} days)
              </div>
              <div>
                <span className="text-slate-400">Type:</span> <strong>{reviewModalLeave.leaveType}</strong>
              </div>
              <div>
                <span className="text-slate-400">Reason:</span> {reviewModalLeave.reason}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Manager Comment / Notes</label>
              <input
                type="text"
                placeholder="e.g. Approved. Sprint coverage confirmed."
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleReview('REJECTED')}
                className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => handleReview('APPROVED')}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
