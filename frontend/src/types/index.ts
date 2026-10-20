export type Role = 'ROLE_ADMIN' | 'ROLE_HR_MANAGER' | 'ROLE_MANAGER' | 'ROLE_EMPLOYEE';

export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  employeeId?: number;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  managerName: string;
  budget: number;
  location: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId?: number;
  departmentName?: string;
  designation: string;
  joiningDate: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  status: 'ACTIVE' | 'ONBOARDING' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
  baseSalary: number;
  bankAccountNumber?: string;
  emergencyContact?: string;
  skills: string;
  attritionRiskScore: number;
  engagementScore: number;
  attritionRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Attendance {
  id: number;
  employee: Employee;
  date: string;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'REMOTE';
  notes?: string;
}

export interface LeaveRequest {
  id: number;
  employee: Employee;
  leaveType: 'CASUAL' | 'SICK' | 'PAID' | 'MATERNITY' | 'PATERNITY' | 'UNPAID';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  appliedOn: string;
  approvedBy?: string;
  reviewerComment?: string;
}

export interface Payroll {
  id: number;
  employee: Employee;
  payPeriod: string;
  baseSalary: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  pfDeduction: number;
  taxDeduction: number;
  otherDeduction: number;
  netSalary: number;
  status: 'DRAFT' | 'PROCESSED' | 'PAID' | 'FAILED';
  paymentDate?: string;
  transactionRef?: string;
}

export interface PerformanceReview {
  id: number;
  employee: Employee;
  reviewerName: string;
  cycleYear: number;
  quarter: string;
  technicalScore: number;
  leadershipScore: number;
  deliveryScore: number;
  overallRating: number;
  selfFeedback: string;
  managerFeedback: string;
  goalsAchievedPercent: number;
  status: 'PENDING_SELF' | 'PENDING_MANAGER' | 'COMPLETED';
  reviewedAt: string;
}

export interface AiInsight {
  id: number;
  category: 'ATTRITION_RISK' | 'SKILL_GAP' | 'WORKFORCE_OPTIMIZATION' | 'ENGAGEMENT';
  title: string;
  description: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  metricValue: string;
  createdAt: string;
}

export interface AiPredictionResult {
  employeeId: number;
  employeeName: string;
  department: string;
  designation: string;
  attritionRiskScore: number;
  attritionRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  engagementScore: number;
  topRiskFactors: string[];
  recommendedInterventions: string[];
  confidenceScore: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveCount: number;
  attendanceRateToday: number;
  monthlyPayrollExpense: number;
  averageEngagementScore: number;
  highAttritionRiskCount: number;
  departmentDistribution: Record<string, number>;
  attendanceStatusDistribution: Record<string, number>;
}

export interface NotificationItem {
  id: number;
  recipientEmail: string;
  title: string;
  message: string;
  type: 'LEAVE' | 'PAYROLL' | 'PERFORMANCE' | 'SYSTEM' | 'ATTENDANCE' | 'AI_ALERT';
  isRead: boolean;
  createdAt: string;
}
