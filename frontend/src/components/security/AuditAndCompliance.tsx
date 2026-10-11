import React from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  CheckCircle,
  FileCheck,
  Eye,
  Server
} from 'lucide-react';

export const AuditAndCompliance: React.FC = () => {
  const owaspMitigations = [
    { id: 'A01:2021', name: 'Broken Access Control', status: 'MITIGATED', detail: 'Declarative @PreAuthorize method security enforced across all controllers with role hierarchy (ADMIN > HR > MANAGER > EMPLOYEE).' },
    { id: 'A02:2021', name: 'Cryptographic Failures', status: 'MITIGATED', detail: 'Stateless JJWT tokens with HMAC-SHA256 signature, 24-hour expiration, and BCrypt 12-round password hashing.' },
    { id: 'A03:2021', name: 'Injection (SQL/NoSQL)', status: 'MITIGATED', detail: 'Zero dynamic SQL string concatenation. 100% Spring Data JPA and Hibernate parameterized queries with typed criteria.' },
    { id: 'A04:2021', name: 'Insecure Design', status: 'MITIGATED', detail: 'Defense-in-depth architecture with separation of concerns: API Gateway, JWT Filters, Service Layer, and isolated DB repositories.' },
    { id: 'A05:2021', name: 'Security Misconfiguration', status: 'MITIGATED', detail: 'Explicit CORS allowed origins, disabled H2 console in production profile, structured error responses avoiding stack trace leak.' },
    { id: 'A07:2021', name: 'Identification & Auth Failures', status: 'MITIGATED', detail: 'Dual-token mechanism: short-lived access JWT + validated refresh token rotation.' }
  ];

  const rbacMatrix = [
    { feature: 'Dashboard Executive Analytics', admin: true, hr: true, manager: true, employee: true },
    { feature: 'Employee Directory & Search', admin: true, hr: true, manager: true, employee: false },
    { feature: 'Onboard / Offboard Employees', admin: true, hr: true, manager: false, employee: false },
    { feature: 'Biometric Clock In / Clock Out', admin: true, hr: true, manager: true, employee: true },
    { feature: 'Leave Application Submission', admin: true, hr: true, manager: true, employee: true },
    { feature: 'Leave Review & Approvals', admin: true, hr: true, manager: true, employee: false },
    { feature: 'Batch Monthly Payroll Runs', admin: true, hr: true, manager: false, employee: false },
    { feature: 'Download Personal Payslip', admin: true, hr: true, manager: true, employee: true },
    { feature: 'Performance Review Publishing', admin: true, hr: true, manager: true, employee: false },
    { feature: 'AI Attrition Flight Risk Radar', admin: true, hr: true, manager: true, employee: false },
    { feature: 'Security Audit & Compliance Logs', admin: true, hr: false, manager: false, employee: false }
  ];

  const auditEvents = [
    { time: '13:00:15 UTC', action: 'BATCH_PAYROLL_RUN', actor: 'admin@zidio.com', status: 'SUCCESS', details: 'Processed 10 records for March 2026. Payout: $84,500' },
    { time: '12:45:22 UTC', action: 'AUTH_TOKEN_ISSUED', actor: 'hr@zidio.com', status: 'SUCCESS', details: 'JWT HS-256 token generated via /api/auth/login' },
    { time: '11:20:10 UTC', action: 'LEAVE_APPROVAL', actor: 'manager@zidio.com', status: 'SUCCESS', details: 'Approved Casual Leave for Alex Turner (EMP-1001)' },
    { time: '10:05:44 UTC', action: 'BIOMETRIC_PUNCH_IN', actor: 'alex.turner@zidio.com', status: 'SUCCESS', details: 'RFID badge authenticated at Main Gate Station' },
    { time: '09:12:00 UTC', action: 'AI_MODEL_INFERENCE', actor: 'system', status: 'SUCCESS', details: 'Flight risk scoring computed with 88.4% model confidence' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Security, Privacy & OWASP Top 10 Compliance
          </h1>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Enterprise Grade
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Section 6: Role-Based Access Control, JWT Security, Data Encryption and Immutable Audit Logging
        </p>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Key className="h-5 w-5" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Authentication</h3>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Spring Security 6 + JWT</p>
          <p className="mt-1 text-[11px] text-slate-500">Stateless bearer token rotation with BCrypt password hashing</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Lock className="h-5 w-5" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Access Control</h3>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Method-Level RBAC</p>
          <p className="mt-1 text-[11px] text-slate-500">@PreAuthorize security guards for sensitive HR endpoints</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Database className="h-5 w-5" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Data Protection</h3>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">ACID + Parameterized</p>
          <p className="mt-1 text-[11px] text-slate-500">Hibernate ORM shielding against SQL injection vectors</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <FileCheck className="h-5 w-5" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Auditability</h3>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Full Audit Trails</p>
          <p className="mt-1 text-[11px] text-slate-500">Sensitive payroll, appraisal and leave changes logged</p>
        </div>
      </div>

      {/* OWASP Mitigation Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">OWASP Top 10 Mitigation Verification</h3>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> 100% Pass
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-semibold">Standard ID</th>
                <th className="px-6 py-3 font-semibold">Vulnerability Vector</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Applied Defense Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {owaspMitigations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.id}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Role Permissions Matrix */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Role-Based Access Control (RBAC) Entitlement Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-semibold">Platform Capability / Action</th>
                <th className="px-6 py-3 font-semibold text-center">ROLE_ADMIN</th>
                <th className="px-6 py-3 font-semibold text-center">ROLE_HR_MANAGER</th>
                <th className="px-6 py-3 font-semibold text-center">ROLE_MANAGER</th>
                <th className="px-6 py-3 font-semibold text-center">ROLE_EMPLOYEE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {rbacMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{row.feature}</td>
                  <td className="px-6 py-3 text-center">
                    {row.admin ? <span className="text-emerald-600 font-bold">✓ Enabled</span> : <span className="text-slate-300">✕</span>}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.hr ? <span className="text-emerald-600 font-bold">✓ Enabled</span> : <span className="text-slate-300">✕</span>}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.manager ? <span className="text-emerald-600 font-bold">✓ Enabled</span> : <span className="text-slate-300">✕</span>}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.employee ? <span className="text-emerald-600 font-bold">✓ Enabled</span> : <span className="text-slate-300">✕</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Event Stream */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Immutable Security Audit Trail</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {auditEvents.map((evt, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 text-[11px]">{evt.time}</span>
                <span className="font-bold text-slate-900 dark:text-white">{evt.action}</span>
                <span className="text-slate-500">by {evt.actor}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 dark:text-slate-400">{evt.details}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {evt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
