package com.zidio.nexushr.config;

import com.zidio.nexushr.model.Attendance;
import com.zidio.nexushr.model.LeaveRequest;
import com.zidio.nexushr.model.Notification;
import com.zidio.nexushr.model.PerformanceReview;
import com.zidio.nexushr.repository.AttendanceRepository;
import com.zidio.nexushr.repository.LeaveRequestRepository;
import com.zidio.nexushr.repository.NotificationRepository;
import com.zidio.nexushr.repository.PerformanceReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class WorkforceDataInitializer implements CommandLineRunner {
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRepository;
    private final PerformanceReviewRepository performanceRepository;
    private final NotificationRepository notificationRepository;

    public WorkforceDataInitializer(AttendanceRepository attendanceRepository,
                                    LeaveRequestRepository leaveRepository,
                                    PerformanceReviewRepository performanceRepository,
                                    NotificationRepository notificationRepository) {
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.performanceRepository = performanceRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) {
        if (attendanceRepository.count() != 0) {
            return;
        }

        LocalDate today = LocalDate.now();
        attendanceRepository.saveAll(List.of(
                attendance(1L, today, "09:02", "18:05", 9.0, Attendance.AttendanceStatus.PRESENT, "Main biometric station"),
                attendance(2L, today, "08:45", "17:30", 8.7, Attendance.AttendanceStatus.PRESENT, "Executive RFID check"),
                attendance(3L, today, "09:10", null, null, Attendance.AttendanceStatus.PRESENT, "People ops kiosk"),
                attendance(4L, today, "10:05", null, null, Attendance.AttendanceStatus.LATE, "Morning commute delay"),
                attendance(6L, today, "09:00", "17:45", 8.7, Attendance.AttendanceStatus.REMOTE, "Approved remote Friday")
        ));

        LeaveRequest pending = new LeaveRequest();
        pending.setEmployeeId(4L);
        pending.setLeaveType(LeaveRequest.LeaveType.PAID);
        pending.setStartDate(today.plusDays(5));
        pending.setEndDate(today.plusDays(8));
        pending.setDaysCount(4);
        pending.setReason("Annual family recharge and wellness leave");
        pending.setAppliedOn(LocalDateTime.now().minusHours(4));

        LeaveRequest approved = new LeaveRequest();
        approved.setEmployeeId(1L);
        approved.setLeaveType(LeaveRequest.LeaveType.CASUAL);
        approved.setStartDate(today.minusDays(10));
        approved.setEndDate(today.minusDays(9));
        approved.setDaysCount(2);
        approved.setReason("Personal relocation errands");
        approved.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        approved.setApprovedBy("David Miller");
        approved.setReviewerComment("Approved. Coverage arranged.");
        leaveRepository.saveAll(List.of(pending, approved));

        PerformanceReview review = new PerformanceReview();
        review.setEmployeeId(1L);
        review.setReviewerName("David Miller");
        review.setCycleYear(2026);
        review.setQuarter("Q1");
        review.setTechnicalScore(4.8);
        review.setLeadershipScore(4.4);
        review.setDeliveryScore(4.7);
        review.setOverallRating(4.7);
        review.setGoalsAchievedPercent(96);
        review.setSelfFeedback("Delivered NexusHR architecture with zero latency degradation.");
        review.setManagerFeedback("Outstanding technical leadership and mentorship.");
        performanceRepository.save(review);

        notificationRepository.saveAll(List.of(
                new Notification("hr@zidio.com", "Leave Application Submitted", "Sophia Chen applied for 4 days of Paid Leave.", Notification.NotificationType.LEAVE),
                new Notification("alex.turner@zidio.com", "March 2026 Payslip Available", "Your monthly payslip is available.", Notification.NotificationType.PAYROLL),
                new Notification("admin@zidio.com", "AI Workforce Alert", "Predictive attrition analysis completed for 10 employees.", Notification.NotificationType.AI_ALERT)
        ));
    }

    private Attendance attendance(Long employeeId, LocalDate date, String punchIn, String punchOut,
                                  Double hours, Attendance.AttendanceStatus status, String notes) {
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setDate(date);
        attendance.setPunchIn(punchIn == null ? null : LocalTime.parse(punchIn));
        attendance.setPunchOut(punchOut == null ? null : LocalTime.parse(punchOut));
        attendance.setTotalHours(hours);
        attendance.setStatus(status);
        attendance.setNotes(notes);
        return attendance;
    }
}
