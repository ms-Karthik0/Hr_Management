package com.zidio.nexushr.dto;

import com.zidio.nexushr.model.Attendance.AttendanceStatus;

public class AttendancePunchDto {
    private Long employeeId;
    private AttendanceStatus status;
    private String notes;

    public AttendancePunchDto() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
