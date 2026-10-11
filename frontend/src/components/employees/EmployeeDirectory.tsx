import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Employee } from '../../types';
import { api } from '../../services/api';
import {
  Users,
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  Briefcase,
  X,
  AlertCircle,
  BrainCircuit,
  Trash2
} from 'lucide-react';

export const EmployeeDirectory: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentName: 'Engineering & Technology',
    designation: '',
    baseSalary: 8500,
    skills: 'Java, Spring Boot, React',
    employmentType: 'FULL_TIME' as Employee['employmentType']
  });

  const isPrivileged = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR_MANAGER';

  useEffect(() => {
    loadEmployees();
  }, [search]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployees(search);
      setEmployees(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEmployee(formData);
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        departmentName: 'Engineering & Technology',
        designation: '',
        baseSalary: 8500,
        skills: 'Java, Spring Boot, React',
        employmentType: 'FULL_TIME'
      });
      await loadEmployees();
    } catch (err: any) {
      alert(err.message || 'Failed to create employee');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to offboard/remove this employee?')) return;
    await api.deleteEmployee(id);
    if (selectedEmp?.id === id) setSelectedEmp(null);
    await loadEmployees();
  };

  const handleStatusChange = async (id: number, status: Employee['status']) => {
    await api.updateEmployee(id, { status });
    if (selectedEmp && selectedEmp.id === id) {
      setSelectedEmp({ ...selectedEmp, status });
    }
    await loadEmployees();
  };

  const filteredEmployees = employees.filter(emp => {
    if (departmentFilter !== 'ALL' && emp.departmentName && !emp.departmentName.includes(departmentFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employee Lifecycle Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            F-01: Onboarding, profile management, role assignment and offboarding workflows
          </p>
        </div>
        {isPrivileged && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Onboard New Employee</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, code, skills, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-xs"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product & UX</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance & Operations</option>
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmp(emp)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-xs">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{emp.designation}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    emp.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{emp.departmentName || 'General'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{emp.phone}</span>
                </div>
              </div>

              {/* AI Flight Risk indicator */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-2 text-[11px] dark:bg-slate-800/60">
                <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                  <BrainCircuit className="h-3.5 w-3.5 text-indigo-500" />
                  AI Flight Risk:
                </span>
                <span
                  className={`font-bold ${
                    emp.attritionRiskLevel === 'HIGH'
                      ? 'text-rose-600 dark:text-rose-400'
                      : emp.attritionRiskLevel === 'MEDIUM'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {emp.attritionRiskScore}% ({emp.attritionRiskLevel})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">
                  {selectedEmp.firstName[0]}{selectedEmp.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedEmp.firstName} {selectedEmp.lastName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedEmp.employeeCode} • {selectedEmp.designation}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmp(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-800/50">
                <div>
                  <span className="text-slate-400">Department:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedEmp.departmentName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Employment Type:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedEmp.employmentType}</div>
                </div>
                <div>
                  <span className="text-slate-400">Joining Date:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedEmp.joiningDate}</div>
                </div>
                <div>
                  <span className="text-slate-400">Base Salary:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">${selectedEmp.baseSalary?.toLocaleString()} / mo</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Technical Skills & Competencies</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedEmp.skills?.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Flight Risk Explainability */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      Predictive Flight Risk Assessment
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      selectedEmp.attritionRiskLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : selectedEmp.attritionRiskLevel === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {selectedEmp.attritionRiskScore}% Probability
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Engagement Score: <strong>{selectedEmp.engagementScore}%</strong> • Machine learning confidence &gt;88%
                </div>
              </div>

              {/* Lifecycle Actions */}
              {isPrivileged && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Lifecycle Status:</span>
                    <select
                      value={selectedEmp.status}
                      onChange={(e) => handleStatusChange(selectedEmp.id, e.target.value as Employee['status'])}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="ONBOARDING">ONBOARDING</option>
                      <option value="ON_LEAVE">ON_LEAVE</option>
                      <option value="RESIGNED">RESIGNED</option>
                      <option value="TERMINATED">TERMINATED</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedEmp.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Offboard</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Onboard New Employee</h3>
                <p className="text-xs text-slate-500">Complete employee lifecycle onboarding workflow</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Department</label>
                  <select
                    value={formData.departmentName}
                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Product & UX Design">Product & UX Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                    <option value="Sales & Growth">Sales & Growth</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Java Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Monthly Base Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
                >
                  Confirm Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
