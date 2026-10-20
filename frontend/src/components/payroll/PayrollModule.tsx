import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Payroll } from '../../types';
import { api } from '../../services/api';
import {
  CreditCard,
  Printer,
  CheckCircle,
  FileText,
  DollarSign,
  Building,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';

export const PayrollModule: React.FC = () => {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('March 2026');
  const [selectedPayslip, setSelectedPayslip] = useState<Payroll | null>(null);

  const isPrivileged = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR_MANAGER';

  useEffect(() => {
    loadPayroll();
  }, [selectedPeriod]);

  const loadPayroll = async () => {
    setLoading(true);
    try {
      const data = await api.getPayrolls(selectedPeriod);
      setPayrolls(data);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBatch = async () => {
    setBatchLoading(true);
    try {
      const data = await api.runBatchPayroll(selectedPeriod);
      setPayrolls(data);
    } finally {
      setBatchLoading(false);
    }
  };

  const handleMarkPaid = async (id: number) => {
    await api.markPayrollPaid(id);
    await loadPayroll();
    if (selectedPayslip?.id === id) {
      setSelectedPayslip(prev => prev ? { ...prev, status: 'PAID' } : null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalGross = payrolls.reduce((acc, p) => acc + p.grossSalary, 0);
  const totalNet = payrolls.reduce((acc, p) => acc + p.netSalary, 0);
  const totalTax = payrolls.reduce((acc, p) => acc + p.taxDeduction, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Automated Payroll & Payslip Processing
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            F-03: Salary computation, statutory tax deductions, and exportable payslips
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-xs"
          >
            <option value="March 2026">March 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="January 2026">January 2026</option>
          </select>

          {isPrivileged && (
            <button
              onClick={handleRunBatch}
              disabled={batchLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{batchLoading ? 'Processing...' : 'Run Automated Batch Run'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Gross Salary ({selectedPeriod})</span>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            ${totalGross.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Base salary + HRA + Allowances</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Statutory Deductions (TDS / PF)</span>
          <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
            ${totalTax.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Automated income tax withholding</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Net Corporate Payout</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${totalNet.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Direct deposit disbursement</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 no-print">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Monthly Payslip Register</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-semibold">Employee</th>
                <th className="px-6 py-3 font-semibold">Base Salary</th>
                <th className="px-6 py-3 font-semibold">HRA</th>
                <th className="px-6 py-3 font-semibold">Allowances</th>
                <th className="px-6 py-3 font-semibold">Gross</th>
                <th className="px-6 py-3 font-semibold">Deductions</th>
                <th className="px-6 py-3 font-semibold">Net Payout</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {payrolls.map((p) => {
                const totalDed = p.pfDeduction + p.taxDeduction + p.otherDeduction;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {p.employee.firstName} {p.employee.lastName}
                      <span className="block text-[11px] font-normal text-slate-400">{p.employee.employeeCode}</span>
                    </td>
                    <td className="px-6 py-3.5">${p.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-3.5">${p.hra.toLocaleString()}</td>
                    <td className="px-6 py-3.5">${p.allowances.toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-semibold">${p.grossSalary.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-rose-600 dark:text-rose-400">-${totalDed.toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      ${p.netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedPayslip(p)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>View Payslip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Viewer Modal & Print Template */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800 no-print">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Payslip Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="mt-6 space-y-6">
              {/* Company Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-6 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">ZIDIO DEVELOPMENT</h2>
                  <p className="text-xs text-slate-500">Java Full-Stack Domain • NexusHR Enterprise Edition</p>
                  <p className="text-xs text-slate-400">100 Enterprise Way, Silicon Valley, CA</p>
                </div>
                <div className="text-right">
                  <div className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    PAYSLIP • {selectedPayslip.payPeriod}
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-slate-400">Ref: {selectedPayslip.transactionRef}</div>
                </div>
              </div>

              {/* Employee Meta Details */}
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60">
                <div>
                  <span className="text-slate-400">Employee Name:</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPayslip.employee.firstName} {selectedPayslip.employee.lastName}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Employee ID:</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{selectedPayslip.employee.employeeCode}</div>
                </div>
                <div>
                  <span className="text-slate-400">Designation:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayslip.employee.designation}</div>
                </div>
                <div>
                  <span className="text-slate-400">Department:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayslip.employee.departmentName}</div>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                {/* Earnings */}
                <div className="space-y-2">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px] border-b pb-1">
                    Earnings (Credits)
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Base Basic Salary</span>
                    <span className="font-semibold">${selectedPayslip.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-semibold">${selectedPayslip.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Special Allowances</span>
                    <span className="font-semibold">${selectedPayslip.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                    <span>Total Gross Earnings</span>
                    <span>${selectedPayslip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-2">
                  <div className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[11px] border-b pb-1">
                    Deductions (Debits)
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Provident Fund (PF)</span>
                    <span className="font-semibold">${selectedPayslip.pfDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Income Tax / TDS</span>
                    <span className="font-semibold">${selectedPayslip.taxDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Medical Insurance</span>
                    <span className="font-semibold">${selectedPayslip.otherDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-rose-600 dark:border-slate-700 dark:text-rose-400">
                    <span>Total Deductions</span>
                    <span>-${(selectedPayslip.pfDeduction + selectedPayslip.taxDeduction + selectedPayslip.otherDeduction).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white shadow-lg">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">Net Pay Distribution</div>
                  <div className="text-3xl font-extrabold">${selectedPayslip.netSalary.toLocaleString()}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold">Disbursed via Direct ACH</div>
                  <div className="text-emerald-100">Date: {selectedPayslip.paymentDate}</div>
                </div>
              </div>

              {/* Mark as Paid Action */}
              {isPrivileged && selectedPayslip.status !== 'PAID' && (
                <div className="flex justify-end pt-3 no-print">
                  <button
                    onClick={() => handleMarkPaid(selectedPayslip.id)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Disburse Salary (Mark as Paid)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
