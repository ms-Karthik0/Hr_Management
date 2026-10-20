import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PerformanceReview, Employee } from '../../types';
import { api } from '../../services/api';
import {
  Award,
  Star,
  Plus,
  TrendingUp,
  Target,
  MessageSquare,
  CheckCircle,
  X
} from 'lucide-react';

export const PerformanceAppraisals: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState<number>(1);
  const [technicalScore, setTechnicalScore] = useState(4.5);
  const [leadershipScore, setLeadershipScore] = useState(4.0);
  const [deliveryScore, setDeliveryScore] = useState(4.5);
  const [goalsAchieved, setGoalsAchieved] = useState(90);
  const [selfFeedback, setSelfFeedback] = useState('');
  const [managerFeedback, setManagerFeedback] = useState('');

  const isPrivileged = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR_MANAGER' || user?.role === 'ROLE_MANAGER';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, emps] = await Promise.all([
        api.getReviews(),
        api.getEmployees()
      ]);
      setReviews(revs);
      setEmployees(emps);
      if (emps.length > 0) setSelectedEmpId(emps[0].id);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitReview({
        employeeId: selectedEmpId,
        reviewerName: `${user?.firstName} ${user?.lastName}`,
        cycleYear: 2026,
        quarter: 'Q1',
        technicalScore,
        leadershipScore,
        deliveryScore,
        selfFeedback,
        managerFeedback,
        goalsAchievedPercent: goalsAchieved
      });
      setShowModal(false);
      setSelfFeedback('');
      setManagerFeedback('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance & 360 Appraisals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            F-04: Quarterly scorecards, multi-stakeholder evaluations, and KPI goal achievement
          </p>
        </div>
        {isPrivileged && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Conduct Appraisal Review</span>
          </button>
        )}
      </div>

      {/* Review Scorecards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {rev.quarter} {rev.cycleYear} Scorecard
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {rev.employee.firstName} {rev.employee.lastName}
                </h3>
                <p className="text-xs text-slate-500">{rev.employee.designation} • {rev.employee.departmentName}</p>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1 text-sm font-black text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{rev.overallRating} / 5.0</span>
                </div>
                <span className="mt-1 text-[10px] text-slate-400">Reviewer: {rev.reviewerName}</span>
              </div>
            </div>

            {/* Scorecard Sliders / Meters */}
            <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Technical Competency (40%)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{rev.technicalScore} / 5.0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(rev.technicalScore / 5) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Leadership & Collaboration (30%)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{rev.leadershipScore} / 5.0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(rev.leadershipScore / 5) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Project Delivery & Execution (30%)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{rev.deliveryScore} / 5.0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(rev.deliveryScore / 5) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* OKR Goal Achievement */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs dark:border-emerald-950 dark:bg-emerald-950/30">
              <span className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <Target className="h-4 w-4" />
                OKR Objectives Met:
              </span>
              <span className="font-black text-emerald-700 dark:text-emerald-200">
                {rev.goalsAchievedPercent}% Target Hit
              </span>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-2 text-xs">
              {rev.managerFeedback && (
                <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Manager Evaluation:</span>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 italic">&ldquo;{rev.managerFeedback}&rdquo;</p>
                </div>
              )}
              {rev.selfFeedback && (
                <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Self Assessment:</span>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 italic">&ldquo;{rev.selfFeedback}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Appraisal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit 360 Performance Appraisal</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Technical (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={technicalScore}
                    onChange={(e) => setTechnicalScore(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Leadership (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={leadershipScore}
                    onChange={(e) => setLeadershipScore(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Delivery (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={deliveryScore}
                    onChange={(e) => setDeliveryScore(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Goals Achieved (%): {goalsAchieved}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goalsAchieved}
                  onChange={(e) => setGoalsAchieved(Number(e.target.value))}
                  className="mt-2 w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Manager Evaluation Feedback</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Key contributions and areas of growth..."
                  value={managerFeedback}
                  onChange={(e) => setManagerFeedback(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Self Evaluation Notes</label>
                <textarea
                  rows={2}
                  placeholder="Employee self reflections..."
                  value={selfFeedback}
                  onChange={(e) => setSelfFeedback(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
                >
                  Publish Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
