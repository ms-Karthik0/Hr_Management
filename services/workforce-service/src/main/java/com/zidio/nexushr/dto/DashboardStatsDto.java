package com.zidio.nexushr.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalEmployees;
    private long activeEmployees;
    private long onLeaveCount;
    private double attendanceRateToday;
    private double monthlyPayrollExpense;
    private double averageEngagementScore;
    private long highAttritionRiskCount;
    private Map<String, Long> departmentDistribution;
    private Map<String, Long> attendanceStatusDistribution;

    public DashboardStatsDto() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getOnLeaveCount() { return onLeaveCount; }
    public void setOnLeaveCount(long onLeaveCount) { this.onLeaveCount = onLeaveCount; }

    public double getAttendanceRateToday() { return attendanceRateToday; }
    public void setAttendanceRateToday(double attendanceRateToday) { this.attendanceRateToday = attendanceRateToday; }

    public double getMonthlyPayrollExpense() { return monthlyPayrollExpense; }
    public void setMonthlyPayrollExpense(double monthlyPayrollExpense) { this.monthlyPayrollExpense = monthlyPayrollExpense; }

    public double getAverageEngagementScore() { return averageEngagementScore; }
    public void setAverageEngagementScore(double averageEngagementScore) { this.averageEngagementScore = averageEngagementScore; }

    public long getHighAttritionRiskCount() { return highAttritionRiskCount; }
    public void setHighAttritionRiskCount(long highAttritionRiskCount) { this.highAttritionRiskCount = highAttritionRiskCount; }

    public Map<String, Long> getDepartmentDistribution() { return departmentDistribution; }
    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) { this.departmentDistribution = departmentDistribution; }

    public Map<String, Long> getAttendanceStatusDistribution() { return attendanceStatusDistribution; }
    public void setAttendanceStatusDistribution(Map<String, Long> attendanceStatusDistribution) { this.attendanceStatusDistribution = attendanceStatusDistribution; }
}
