package com.zidio.nexushr.service;

import com.zidio.nexushr.dto.LeaveApplyDto;
import com.zidio.nexushr.dto.LeaveReviewDto;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.model.LeaveRequest;
import com.zidio.nexushr.model.Notification;
import com.zidio.nexushr.repository.EmployeeRepository;
import com.zidio.nexushr.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    public LeaveService(LeaveRequestRepository leaveRequestRepository,
                        EmployeeRepository employeeRepository,
                        NotificationService notificationService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.notificationService = notificationService;
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getLeavesByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getLeavesByStatus(LeaveRequest.LeaveStatus status) {
        return leaveRequestRepository.findByStatus(status);
    }

    @Transactional
    public LeaveRequest applyLeave(LeaveApplyDto dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + dto.getEmployeeId()));

        LeaveRequest request = new LeaveRequest();
        request.setEmployee(employee);
        request.setLeaveType(dto.getLeaveType());
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());
        request.setReason(dto.getReason());
        request.setStatus(LeaveRequest.LeaveStatus.PENDING);

        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;
        request.setDaysCount((int) Math.max(1, days));

        LeaveRequest saved = leaveRequestRepository.save(request);

        notificationService.notifyLeaveApplication(employee.getFirstName() + " " + employee.getLastName(), dto.getLeaveType().name(), (int) days);

        return saved;
    }

    @Transactional
    public LeaveRequest reviewLeave(Long leaveId, LeaveReviewDto dto) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + leaveId));

        request.setStatus(dto.getStatus());
        request.setReviewerComment(dto.getReviewerComment());
        request.setApprovedBy(dto.getApprovedBy());

        LeaveRequest updated = leaveRequestRepository.save(request);

        // Update employee status if leave is active today
        if (dto.getStatus() == LeaveRequest.LeaveStatus.APPROVED) {
            Employee emp = request.getEmployee();
            notificationService.createNotification(
                    emp.getEmail(),
                    "Leave Request " + dto.getStatus().name(),
                    "Your " + request.getLeaveType() + " leave request for " + request.getDaysCount() + " days has been " + dto.getStatus().name().toLowerCase() + ". Notes: " + (dto.getReviewerComment() != null ? dto.getReviewerComment() : "None"),
                    Notification.NotificationType.LEAVE
            );
        }

        return updated;
    }
}
