import {
  User, Employee, Attendance, LeaveRequest, Payroll,
  PerformanceReview, AiInsight, AiPredictionResult,
  DashboardStats, NotificationItem
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('nexus_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fallback initial dataset in case backend is offline
const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, employeeCode: 'EMP-1001', firstName: 'Alex', lastName: 'Turner', email: 'alex.turner@zidio.com', phone: '+1 (555) 234-5678', departmentName: 'Engineering & Technology', designation: 'Senior Full-Stack Engineer', joiningDate: '2023-04-15', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 9500, skills: 'Java 21, Spring Boot, React 19, TypeScript, Docker', attritionRiskScore: 18, engagementScore: 92, attritionRiskLevel: 'LOW' },
  { id: 2, employeeCode: 'EMP-1002', firstName: 'David', lastName: 'Miller', email: 'manager@zidio.com', phone: '+1 (555) 345-6789', departmentName: 'Engineering & Technology', designation: 'Engineering Director', joiningDate: '2021-02-01', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 14500, skills: 'System Architecture, Kubernetes, Cloud, Team Leadership', attritionRiskScore: 12, engagementScore: 95, attritionRiskLevel: 'LOW' },
  { id: 3, employeeCode: 'EMP-1003', firstName: 'Sarah', lastName: 'Jenkins', email: 'hr@zidio.com', phone: '+1 (555) 456-7890', departmentName: 'Human Resources', designation: 'Head of People Operations', joiningDate: '2022-06-10', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 11000, skills: 'HR Strategy, Talent Retention, Performance Analytics, Compliance', attritionRiskScore: 15, engagementScore: 90, attritionRiskLevel: 'LOW' },
  { id: 4, employeeCode: 'EMP-1004', firstName: 'Sophia', lastName: 'Chen', email: 'sophia.chen@zidio.com', phone: '+1 (555) 567-8901', departmentName: 'Engineering & Technology', designation: 'Cloud Infrastructure Lead', joiningDate: '2023-09-20', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 10200, skills: 'AWS, Terraform, Kubernetes, CI/CD, Go', attritionRiskScore: 68, engagementScore: 62, attritionRiskLevel: 'HIGH' },
  { id: 5, employeeCode: 'EMP-1005', firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@zidio.com', phone: '+1 (555) 678-9012', departmentName: 'Finance & Operations', designation: 'VP of Finance', joiningDate: '2020-08-15', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 13500, skills: 'Financial Modeling, Risk Analysis, ERP, Corporate Tax', attritionRiskScore: 22, engagementScore: 88, attritionRiskLevel: 'LOW' },
  { id: 6, employeeCode: 'EMP-1006', firstName: 'Elena', lastName: 'Rostova', email: 'elena.rostova@zidio.com', phone: '+1 (555) 789-0123', departmentName: 'Product & UX Design', designation: 'Principal Product Manager', joiningDate: '2022-11-05', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 11800, skills: 'Product Strategy, User Research, Agile, Analytics', attritionRiskScore: 28, engagementScore: 86, attritionRiskLevel: 'LOW' },
  { id: 7, employeeCode: 'EMP-1007', firstName: 'Liam', lastName: 'Patel', email: 'liam.patel@zidio.com', phone: '+1 (555) 890-1234', departmentName: 'Engineering & Technology', designation: 'AI & Data Engineer', joiningDate: '2024-01-10', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 8800, skills: 'Python, PyTorch, Spring AI, Vector DBs, FastAPI', attritionRiskScore: 42, engagementScore: 74, attritionRiskLevel: 'MEDIUM' },
  { id: 8, employeeCode: 'EMP-1008', firstName: 'Noah', lastName: 'Kim', email: 'noah.kim@zidio.com', phone: '+1 (555) 012-3456', departmentName: 'Product & UX Design', designation: 'Lead UI/UX Designer', joiningDate: '2023-08-14', employmentType: 'FULL_TIME', status: 'ACTIVE', baseSalary: 7800, skills: 'Figma, Design Systems, shadcn/ui, Tailwind CSS', attritionRiskScore: 72, engagementScore: 58, attritionRiskLevel: 'HIGH' }
];

let localEmployees = [...MOCK_EMPLOYEES];

let localAttendance: Attendance[] = [
  { id: 1, employee: MOCK_EMPLOYEES[0], date: new Date().toISOString().split('T')[0], punchIn: '09:02', punchOut: '18:05', totalHours: 9.0, status: 'PRESENT', notes: 'Main biometric station' },
  { id: 2, employee: MOCK_EMPLOYEES[1], date: new Date().toISOString().split('T')[0], punchIn: '08:45', punchOut: '17:30', totalHours: 8.7, status: 'PRESENT', notes: 'Executive RFID check' },
  { id: 3, employee: MOCK_EMPLOYEES[2], date: new Date().toISOString().split('T')[0], punchIn: '09:10', punchOut: '17:40', totalHours: 8.5, status: 'PRESENT', notes: 'People ops kiosk' },
  { id: 4, employee: MOCK_EMPLOYEES[3], date: new Date().toISOString().split('T')[0], punchIn: '10:05', punchOut: '18:30', totalHours: 8.4, status: 'LATE', notes: 'Commute delay' },
  { id: 5, employee: MOCK_EMPLOYEES[5], date: new Date().toISOString().split('T')[0], punchIn: '09:00', punchOut: '17:45', totalHours: 8.7, status: 'REMOTE', notes: 'Approved remote Friday' }
];

let localLeaves: LeaveRequest[] = [
  { id: 1, employee: MOCK_EMPLOYEES[3], leaveType: 'PAID', startDate: '2026-04-02', endDate: '2026-04-05', daysCount: 4, reason: 'Annual recharge & wellness leave', status: 'PENDING', appliedOn: '2026-03-27' },
  { id: 2, employee: MOCK_EMPLOYEES[0], leaveType: 'CASUAL', startDate: '2026-03-15', endDate: '2026-03-16', daysCount: 2, reason: 'Personal relocation errands', status: 'APPROVED', appliedOn: '2026-03-12', approvedBy: 'David Miller', reviewerComment: 'Approved. Coverage arranged.' }
];

let localPayrolls: Payroll[] = [
  { id: 1, employee: MOCK_EMPLOYEES[0], payPeriod: 'March 2026', baseSalary: 9500, hra: 3800, allowances: 1425, grossSalary: 14725, pfDeduction: 1140, taxDeduction: 1472, otherDeduction: 150, netSalary: 11963, status: 'PAID', paymentDate: '2026-03-28', transactionRef: 'TXN-8849201' },
  { id: 2, employee: MOCK_EMPLOYEES[1], payPeriod: 'March 2026', baseSalary: 14500, hra: 5800, allowances: 2175, grossSalary: 22475, pfDeduction: 1740, taxDeduction: 2247, otherDeduction: 150, netSalary: 18338, status: 'PAID', paymentDate: '2026-03-28', transactionRef: 'TXN-9128301' },
  { id: 3, employee: MOCK_EMPLOYEES[2], payPeriod: 'March 2026', baseSalary: 11000, hra: 4400, allowances: 1650, grossSalary: 17050, pfDeduction: 1320, taxDeduction: 1705, otherDeduction: 150, netSalary: 13875, status: 'PAID', paymentDate: '2026-03-28', transactionRef: 'TXN-7419402' },
  { id: 4, employee: MOCK_EMPLOYEES[3], payPeriod: 'March 2026', baseSalary: 10200, hra: 4080, allowances: 1530, grossSalary: 15810, pfDeduction: 1224, taxDeduction: 1581, otherDeduction: 150, netSalary: 12855, status: 'PROCESSED', paymentDate: '2026-03-28', transactionRef: 'TXN-4928172' }
];

let localReviews: PerformanceReview[] = [
  { id: 1, employee: MOCK_EMPLOYEES[0], reviewerName: 'David Miller', cycleYear: 2026, quarter: 'Q1', technicalScore: 4.8, leadershipScore: 4.4, deliveryScore: 4.7, overallRating: 4.7, selfFeedback: 'Shipped high performance architecture with zero regression.', managerFeedback: 'Exceptional technical drive and leadership.', goalsAchievedPercent: 96, status: 'COMPLETED', reviewedAt: '2026-03-25' }
];

let localNotifications: NotificationItem[] = [
  { id: 1, recipientEmail: 'hr@zidio.com', title: 'Leave Application Submitted', message: 'Sophia Chen applied for 4 days of Paid Leave.', type: 'LEAVE', isRead: false, createdAt: '10 mins ago' },
  { id: 2, recipientEmail: 'alex.turner@zidio.com', title: 'March 2026 Payslip Available', message: 'Your monthly salary has been processed and disbursed.', type: 'PAYROLL', isRead: true, createdAt: '2 hours ago' },
  { id: 3, recipientEmail: 'admin@zidio.com', title: 'AI Flight Risk Alert', message: 'Predictive model flagged 2 employees with >65% attrition risk.', type: 'AI_ALERT', isRead: false, createdAt: 'Yesterday' }
];

export const api = {
  // Auth
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      return await res.json();
    } catch {
      // Mock demo accounts fallback
      const roleMap: Record<string, string> = {
        'admin@zidio.com': 'ROLE_ADMIN',
        'hr@zidio.com': 'ROLE_HR_MANAGER',
        'manager@zidio.com': 'ROLE_MANAGER',
        'alex.turner@zidio.com': 'ROLE_EMPLOYEE'
      };
      const role = roleMap[email] || 'ROLE_EMPLOYEE';
      return {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token',
        email,
        firstName: email.split('@')[0].split('.')[0],
        lastName: 'User',
        role,
        employeeId: 1
      };
    }
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {
      // Return mock stats
    }
    return {
      totalEmployees: localEmployees.length,
      activeEmployees: localEmployees.filter(e => e.status === 'ACTIVE').length,
      onLeaveCount: 1,
      attendanceRateToday: 92.5,
      monthlyPayrollExpense: 845000,
      averageEngagementScore: 84.6,
      highAttritionRiskCount: localEmployees.filter(e => e.attritionRiskLevel === 'HIGH').length,
      departmentDistribution: {
        'Engineering': 4,
        'Product & UX': 2,
        'Human Resources': 1,
        'Finance & Ops': 1
      },
      attendanceStatusDistribution: {
        'PRESENT': 3,
        'LATE': 1,
        'REMOTE': 1
      }
    };
  },

  // Employees
  async getEmployees(search?: string): Promise<Employee[]> {
    try {
      const url = search ? `${API_BASE}/employees?search=${encodeURIComponent(search)}` : `${API_BASE}/employees`;
      const res = await fetch(url, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}

    if (search && search.trim()) {
      const q = search.toLowerCase();
      return localEmployees.filter(e =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q)
      );
    }
    return localEmployees;
  },

  async createEmployee(emp: Partial<Employee>): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(emp)
      });
      if (res.ok) return await res.json();
    } catch {}

    const newEmp: Employee = {
      id: localEmployees.length + 1,
      employeeCode: emp.employeeCode || `EMP-${1000 + localEmployees.length + 1}`,
      firstName: emp.firstName || 'New',
      lastName: emp.lastName || 'Hire',
      email: emp.email || `employee${Date.now()}@zidio.com`,
      phone: emp.phone || '+1 (555) 000-0000',
      departmentName: emp.departmentName || 'Engineering & Technology',
      designation: emp.designation || 'Software Engineer',
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
      employmentType: emp.employmentType || 'FULL_TIME',
      status: emp.status || 'ACTIVE',
      baseSalary: emp.baseSalary || 7500,
      skills: emp.skills || 'Java, React, SQL',
      attritionRiskScore: 20,
      engagementScore: 85,
      attritionRiskLevel: 'LOW'
    };
    localEmployees.unshift(newEmp);
    return newEmp;
  },

  async updateEmployee(id: number, emp: Partial<Employee>): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(emp)
      });
      if (res.ok) return await res.json();
    } catch {}

    const index = localEmployees.findIndex(e => e.id === id);
    if (index !== -1) {
      localEmployees[index] = { ...localEmployees[index], ...emp };
      return localEmployees[index];
    }
    throw new Error('Employee not found');
  },

  async deleteEmployee(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
    } catch {}
    localEmployees = localEmployees.filter(e => e.id !== id);
  },

  // Attendance
  async getTodayAttendance(): Promise<Attendance[]> {
    try {
      const res = await fetch(`${API_BASE}/attendance/today`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}
    return localAttendance;
  },

  async punchIn(employeeId: number, status: Attendance['status'] = 'PRESENT', notes?: string): Promise<Attendance> {
    try {
      const res = await fetch(`${API_BASE}/attendance/punch-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ employeeId, status, notes })
      });
      if (res.ok) return await res.json();
    } catch {}

    const emp = localEmployees.find(e => e.id === employeeId) || localEmployees[0];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newAtt: Attendance = {
      id: localAttendance.length + 1,
      employee: emp,
      date: now.toISOString().split('T')[0],
      punchIn: timeStr,
      status,
      notes: notes || 'Biometric web check-in'
    };
    localAttendance.unshift(newAtt);
    return newAtt;
  },

  async punchOut(employeeId: number): Promise<Attendance> {
    try {
      const res = await fetch(`${API_BASE}/attendance/punch-out/${employeeId}`, {
        method: 'POST',
        headers: getAuthHeader()
      });
      if (res.ok) return await res.json();
    } catch {}

    const item = localAttendance.find(a => a.employee.id === employeeId);
    if (item) {
      item.punchOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      item.totalHours = 8.5;
      return item;
    }
    throw new Error('No punch-in recorded today');
  },

  async simulateBiometrics(): Promise<void> {
    try {
      await fetch(`${API_BASE}/attendance/simulate-biometrics`, {
        method: 'POST',
        headers: getAuthHeader()
      });
    } catch {}
  },

  // Leaves
  async getLeaves(): Promise<LeaveRequest[]> {
    try {
      const res = await fetch(`${API_BASE}/leaves`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}
    return localLeaves;
  },

  async applyLeave(data: { employeeId: number; leaveType: LeaveRequest['leaveType']; startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> {
    try {
      const res = await fetch(`${API_BASE}/leaves/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {}

    const emp = localEmployees.find(e => e.id === data.employeeId) || localEmployees[0];
    const newLeave: LeaveRequest = {
      id: localLeaves.length + 1,
      employee: emp,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: 3,
      reason: data.reason,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    localLeaves.unshift(newLeave);
    return newLeave;
  },

  async reviewLeave(id: number, status: 'APPROVED' | 'REJECTED', reviewerComment?: string, approvedBy?: string): Promise<LeaveRequest> {
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status, reviewerComment, approvedBy })
      });
      if (res.ok) return await res.json();
    } catch {}

    const leave = localLeaves.find(l => l.id === id);
    if (leave) {
      leave.status = status;
      leave.reviewerComment = reviewerComment;
      leave.approvedBy = approvedBy || 'Current Manager';
      return leave;
    }
    throw new Error('Leave request not found');
  },

  // Payroll
  async getPayrolls(period: string = 'March 2026'): Promise<Payroll[]> {
    try {
      const res = await fetch(`${API_BASE}/payroll/period?payPeriod=${encodeURIComponent(period)}`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}
    return localPayrolls;
  },

  async runBatchPayroll(period: string = 'March 2026'): Promise<Payroll[]> {
    try {
      const res = await fetch(`${API_BASE}/payroll/batch-run?payPeriod=${encodeURIComponent(period)}`, {
        method: 'POST',
        headers: getAuthHeader()
      });
      if (res.ok) return await res.json();
    } catch {}

    localPayrolls = localEmployees.map((emp, i) => {
      const base = emp.baseSalary;
      const hra = Math.round(base * 0.40);
      const allowances = Math.round(base * 0.15);
      const gross = base + hra + allowances;
      const pf = Math.round(base * 0.12);
      const tax = Math.round(gross * 0.10);
      const other = 150;
      const net = gross - (pf + tax + other);
      return {
        id: i + 1,
        employee: emp,
        payPeriod: period,
        baseSalary: base,
        hra,
        allowances,
        grossSalary: gross,
        pfDeduction: pf,
        taxDeduction: tax,
        otherDeduction: other,
        netSalary: net,
        status: 'PAID',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionRef: 'TXN-' + Math.floor(1000000 + Math.random() * 9000000)
      };
    });
    return localPayrolls;
  },

  async markPayrollPaid(id: number): Promise<Payroll> {
    try {
      const res = await fetch(`${API_BASE}/payroll/${id}/pay`, {
        method: 'PUT',
        headers: getAuthHeader()
      });
      if (res.ok) return await res.json();
    } catch {}

    const p = localPayrolls.find(item => item.id === id);
    if (p) {
      p.status = 'PAID';
      p.paymentDate = new Date().toISOString().split('T')[0];
      return p;
    }
    throw new Error('Payroll not found');
  },

  // Performance
  async getReviews(): Promise<PerformanceReview[]> {
    try {
      const res = await fetch(`${API_BASE}/performance`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}
    return localReviews;
  },

  async submitReview(data: Partial<PerformanceReview> & { employeeId: number }): Promise<PerformanceReview> {
    try {
      const res = await fetch(`${API_BASE}/performance/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {}

    const emp = localEmployees.find(e => e.id === data.employeeId) || localEmployees[0];
    const tech = data.technicalScore || 4.5;
    const lead = data.leadershipScore || 4.0;
    const del = data.deliveryScore || 4.6;
    const overall = Math.round(((tech * 0.4) + (lead * 0.3) + (del * 0.3)) * 10) / 10;

    const newRev: PerformanceReview = {
      id: localReviews.length + 1,
      employee: emp,
      reviewerName: data.reviewerName || 'Executive Reviewer',
      cycleYear: 2026,
      quarter: data.quarter || 'Q1',
      technicalScore: tech,
      leadershipScore: lead,
      deliveryScore: del,
      overallRating: overall,
      selfFeedback: data.selfFeedback || '',
      managerFeedback: data.managerFeedback || '',
      goalsAchievedPercent: data.goalsAchievedPercent || 90,
      status: 'COMPLETED',
      reviewedAt: new Date().toISOString().split('T')[0]
    };
    localReviews.unshift(newRev);
    return newRev;
  },

  // AI Workforce Intelligence
  async getAiInsights(): Promise<AiInsight[]> {
    try {
      const res = await fetch(`${API_BASE}/ai/insights`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}

    return [
      { id: 1, category: 'ATTRITION_RISK', title: 'Elevated Flight Risk Detected: Cloud & UX Specialists', description: 'Predictive algorithm flagged Sophia Chen (Cloud Lead) and Noah Kim (UI/UX) with >65% flight probability due to market compensation divergence and role band stagnation over 18+ months.', impactLevel: 'HIGH', recommendation: 'Initiate merit compensation adjustment and discuss Staff engineer band promotion in Q2 review.', metricValue: 'High Risk (2 Critical Profiles)', createdAt: '2026-03-28' },
      { id: 2, category: 'SKILL_GAP', title: 'Critical Engineering Skill Gap: Spring AI & Cloud Native', description: 'Automated gap analysis shows current workforce competency in Spring AI & Vector DBs is 52% against target benchmark of 75% for 2026 roadmap deliverables.', impactLevel: 'MEDIUM', recommendation: 'Launch internal 4-week cohort training with hands-on lab stipends.', metricValue: '23% Proficiency Deficit', createdAt: '2026-03-27' },
      { id: 3, category: 'ENGAGEMENT', title: 'Peak Engagement Correlation: Flexible Hybrid Work', description: 'Engineering squads utilizing hybrid 2-day in-office schedules demonstrated a 14.8% higher engagement score and 22% lower unplanned sick leave frequency.', impactLevel: 'LOW', recommendation: 'Standardize hybrid guidelines across all engineering and design squads.', metricValue: '88.2% Positive Sentiment', createdAt: '2026-03-26' },
      { id: 4, category: 'WORKFORCE_OPTIMIZATION', title: 'Payroll Run Optimization & Tax Withholding Efficiency', description: 'Automated March 2026 payroll run completed with 100% tax compliance verification and zero reconciliation variance.', impactLevel: 'LOW', recommendation: 'Schedule recurring auto-run on 28th of every month at 23:00 UTC.', metricValue: 'Zero Variance Recorded', createdAt: '2026-03-25' }
    ];
  },

  async getAttritionPredictions(): Promise<AiPredictionResult[]> {
    try {
      const res = await fetch(`${API_BASE}/ai/attrition-predictions`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}

    return [
      {
        employeeId: 8,
        employeeName: 'Noah Kim',
        department: 'Product & UX Design',
        designation: 'Lead UI/UX Designer',
        attritionRiskScore: 72,
        attritionRiskLevel: 'HIGH',
        engagementScore: 58,
        topRiskFactors: ['Critical low engagement index (58%)', 'Base compensation 14% below industry average for Lead Designer', 'Extreme external market demand for modern Design System talent'],
        recommendedInterventions: ['Schedule 1-on-1 career development check-in with HR Business Partner', 'Conduct market parity salary adjustment and retention bonus evaluation', 'Assign design leadership for company-wide brand refresh'],
        confidenceScore: 89.2
      },
      {
        employeeId: 4,
        employeeName: 'Sophia Chen',
        department: 'Engineering & Technology',
        designation: 'Cloud Infrastructure Lead',
        attritionRiskScore: 68,
        attritionRiskLevel: 'HIGH',
        engagementScore: 62,
        topRiskFactors: ['2+ years in current role without band progression or promotion', 'Skillset in extreme external market demand (AWS/Kubernetes/Terraform)', 'Elevated on-call rotation hours over past quarter'],
        recommendedInterventions: ['Review for Q2 merit promotion to Staff Cloud Architect', 'Offer specialized cloud certification sponsorship and technical leadership path', 'Rebalance on-call schedule across European engineering hub'],
        confidenceScore: 88.4
      },
      {
        employeeId: 7,
        employeeName: 'Liam Patel',
        department: 'Engineering & Technology',
        designation: 'AI & Data Engineer',
        attritionRiskScore: 42,
        attritionRiskLevel: 'MEDIUM',
        engagementScore: 74,
        topRiskFactors: ['Moderate engagement dip over last quarter', 'Cross-functional dependency bottlenecks on data pipelines'],
        recommendedInterventions: ['Provide stretch assignments on Spring AI generative workflows', 'Sponsor conference attendance at AI Enterprise Summit'],
        confidenceScore: 85.0
      },
      {
        employeeId: 1,
        employeeName: 'Alex Turner',
        department: 'Engineering & Technology',
        designation: 'Senior Full-Stack Engineer',
        attritionRiskScore: 18,
        attritionRiskLevel: 'LOW',
        engagementScore: 92,
        topRiskFactors: ['High job satisfaction metrics and competitive compensation', 'Strong team integration and peer recognition'],
        recommendedInterventions: ['Maintain quarterly mentoring cadence and recognition rewards'],
        confidenceScore: 92.5
      }
    ];
  },

  async getSkillGaps(): Promise<{ skills: Array<{ skill: string; targetProficiency: number; currentProficiency: number; gap: number; status: string; actionPlan: string }>; overallReadiness: number; primaryUpskillingFocus: string }> {
    try {
      const res = await fetch(`${API_BASE}/ai/skill-gaps`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}

    return {
      skills: [
        { skill: 'Java 21 / Spring Boot 3', targetProficiency: 90, currentProficiency: 84, gap: 6, status: 'MODERATE_GAP', actionPlan: 'Cross-team peer pairing and virtual thread workshop' },
        { skill: 'React 19 / TypeScript', targetProficiency: 85, currentProficiency: 78, gap: 7, status: 'MODERATE_GAP', actionPlan: 'Frontend guild study sessions on modern React actions' },
        { skill: 'Cloud & Kubernetes', targetProficiency: 80, currentProficiency: 63, gap: 17, status: 'CRITICAL_GAP', actionPlan: 'Mandatory 4-week internal cohort training & CKA certification' },
        { skill: 'Spring AI / GenAI Services', targetProficiency: 75, currentProficiency: 52, gap: 23, status: 'CRITICAL_GAP', actionPlan: 'Hands-on enterprise hackathon and vector database lab stipends' },
        { skill: 'Data Analytics & SQL', targetProficiency: 85, currentProficiency: 81, gap: 4, status: 'ON_TRACK', actionPlan: 'Maintain proficiency with brown-bag sessions' },
        { skill: 'Agile & Engineering Leadership', targetProficiency: 80, currentProficiency: 84, gap: -4, status: 'ON_TRACK', actionPlan: 'Workforce exceeds baseline expectations' }
      ],
      overallReadiness: 77.2,
      primaryUpskillingFocus: 'Cloud Infrastructure & Spring AI Integration'
    };
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch {}
    return localNotifications;
  },

  async markNotificationRead(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeader()
      });
    } catch {}
    const n = localNotifications.find(item => item.id === id);
    if (n) n.isRead = true;
  }
};
