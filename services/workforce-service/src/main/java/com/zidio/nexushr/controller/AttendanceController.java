package com.zidio.nexushr.controller;

import com.zidio.nexushr.dto.AttendancePunchDto;
import com.zidio.nexushr.model.Attendance;
import com.zidio.nexushr.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> getTodayAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date != null ? date : LocalDate.now()));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getEmployeeAttendance(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(employeeId));
    }

    @PostMapping("/punch-in")
    public ResponseEntity<Attendance> punchIn(@RequestBody AttendancePunchDto dto) {
        return ResponseEntity.ok(attendanceService.punchIn(dto));
    }

    @PostMapping("/punch-out/{employeeId}")
    public ResponseEntity<Attendance> punchOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.punchOut(employeeId));
    }

    @PostMapping("/simulate-biometrics")
    public ResponseEntity<?> simulateBiometrics() {
        attendanceService.simulateBiometricCheckIns();
        return ResponseEntity.ok(Map.of("message", "Simulated enterprise biometric check-ins generated successfully"));
    }
}
