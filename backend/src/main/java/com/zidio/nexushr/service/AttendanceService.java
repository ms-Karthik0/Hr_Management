package com.zidio.nexushr.service;

import com.zidio.nexushr.dto.AttendancePunchDto;
import com.zidio.nexushr.model.Attendance;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.repository.AttendanceRepository;
import com.zidio.nexushr.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date != null ? date : LocalDate.now());
    }

    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public Attendance punchIn(AttendancePunchDto dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + dto.getEmployeeId()));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), today);
        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
        } else {
            attendance = new Attendance();
            attendance.setEmployee(employee);
            attendance.setDate(today);
            attendance.setPunchIn(now);

            // Determine status based on punch-in time (Standard: 09:15)
            if (dto.getStatus() != null) {
                attendance.setStatus(dto.getStatus());
            } else if (now.isAfter(LocalTime.of(9, 30))) {
                attendance.setStatus(Attendance.AttendanceStatus.LATE);
            } else {
                attendance.setStatus(Attendance.AttendanceStatus.PRESENT);
            }
        }

        if (dto.getNotes() != null) {
            attendance.setNotes(dto.getNotes());
        }

        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance punchOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("No punch-in recorded today for employee id: " + employeeId));

        attendance.setPunchOut(now);
        if (attendance.getPunchIn() != null) {
            Duration duration = Duration.between(attendance.getPunchIn(), now);
            double hours = duration.toMinutes() / 60.0;
            attendance.setTotalHours(Math.round(hours * 10.0) / 10.0);

            if (hours < 4.5 && attendance.getStatus() == Attendance.AttendanceStatus.PRESENT) {
                attendance.setStatus(Attendance.AttendanceStatus.HALF_DAY);
            }
        }

        return attendanceRepository.save(attendance);
    }

    @Transactional
    public void simulateBiometricCheckIns() {
        LocalDate today = LocalDate.now();
        List<Employee> employees = employeeRepository.findAll();

        for (int i = 0; i < employees.size(); i++) {
            Employee emp = employees.get(i);
            if (attendanceRepository.findByEmployeeIdAndDate(emp.getId(), today).isEmpty()) {
                Attendance att = new Attendance();
                att.setEmployee(emp);
                att.setDate(today);

                if (i % 7 == 0) {
                    att.setStatus(Attendance.AttendanceStatus.REMOTE);
                    att.setPunchIn(LocalTime.of(9, 0));
                    att.setPunchOut(LocalTime.of(17, 30));
                    att.setTotalHours(8.5);
                    att.setNotes("Work From Home approved");
                } else if (i % 5 == 0) {
                    att.setStatus(Attendance.AttendanceStatus.LATE);
                    att.setPunchIn(LocalTime.of(9, 45));
                    att.setPunchOut(LocalTime.of(18, 15));
                    att.setTotalHours(8.5);
                    att.setNotes("Traffic delay biometric punch");
                } else {
                    att.setStatus(Attendance.AttendanceStatus.PRESENT);
                    att.setPunchIn(LocalTime.of(8, 55 + (i % 15)));
                    att.setPunchOut(LocalTime.of(17, 45));
                    att.setTotalHours(8.8);
                    att.setNotes("Standard RFID punch");
                }
                attendanceRepository.save(att);
            }
        }
    }
}
