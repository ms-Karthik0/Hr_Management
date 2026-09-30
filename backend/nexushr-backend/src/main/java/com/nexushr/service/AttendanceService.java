package com.nexushr.service;

import com.nexushr.dto.RequestDtos.AttendanceRequest;
import com.nexushr.entity.Attendance;
import com.nexushr.entity.AttendanceStatus;
import com.nexushr.repository.AttendanceRepository;
import com.nexushr.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             EmployeeRepository employeeRepository,
                             EmployeeService employeeService) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.employeeService = employeeService;
    }

    public List<Attendance> mine(String email, LocalDate from, LocalDate to) {
        var employee = employeeService.current(email);
        return attendanceRepository.findByEmployeeIdAndWorkDateBetweenOrderByWorkDateDesc(
                employee.getId(), from, to);
    }

    public Attendance save(String email, AttendanceRequest request) {
        return saveFor(employeeService.current(email).getId(), request);
    }

    public Attendance saveFor(UUID employeeId, AttendanceRequest request) {
        var attendance = attendanceRepository.findByEmployeeIdAndWorkDate(employeeId, request.date())
                .orElseGet(Attendance::new);
        attendance.setEmployee(employeeRepository.findById(employeeId).orElseThrow());
        attendance.setWorkDate(request.date());
        attendance.setStatus(AttendanceStatus.valueOf(request.status()));
        attendance.setCheckIn(request.checkIn());
        attendance.setCheckOut(request.checkOut());
        attendance.setNotes(request.notes());
        return attendanceRepository.save(attendance);
    }
}