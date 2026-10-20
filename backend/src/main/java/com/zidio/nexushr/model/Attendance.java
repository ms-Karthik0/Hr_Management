package com.zidio.nexushr.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private LocalDate date;

    private LocalTime punchIn;
    private LocalTime punchOut;
    private Double totalHours;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    private String notes;

    public enum AttendanceStatus {
        PRESENT, LATE, HALF_DAY, ABSENT, REMOTE
    }

    public Attendance() {}

    public Attendance(Employee employee, LocalDate date, LocalTime punchIn, LocalTime punchOut, Double totalHours, AttendanceStatus status, String notes) {
        this.employee = employee;
        this.date = date;
        this.punchIn = punchIn;
        this.punchOut = punchOut;
        this.totalHours = totalHours;
        this.status = status;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getPunchIn() { return punchIn; }
    public void setPunchIn(LocalTime punchIn) { this.punchIn = punchIn; }

    public LocalTime getPunchOut() { return punchOut; }
    public void setPunchOut(LocalTime punchOut) { this.punchOut = punchOut; }

    public Double getTotalHours() { return totalHours; }
    public void setTotalHours(Double totalHours) { this.totalHours = totalHours; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
