package com.zidio.nexushr.controller;

import com.zidio.nexushr.dto.DashboardStatsDto;
import com.zidio.nexushr.model.Attendance;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.repository.AttendanceRepository;
import com.zidio.nexushr.service.EmployeeClient;
import com.zidio.nexushr.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardAggregator dashboardAggregator;

    public DashboardController(DashboardAggregator dashboardAggregator) {
        this.dashboardAggregator = dashboardAggregator;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(dashboardAggregator.getStats());
    }
}

@Component
class DashboardAggregator {
    private final EmployeeClient employeeClient;
    private final AttendanceRepository attendanceRepository;
    private final JwtTokenProvider tokenProvider;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String payrollUrl;

    DashboardAggregator(EmployeeClient employeeClient, AttendanceRepository attendanceRepository,
                        JwtTokenProvider tokenProvider,
                        @Value("${services.payroll.url}") String payrollUrl) {
        this.employeeClient = employeeClient;
        this.attendanceRepository = attendanceRepository;
        this.tokenProvider = tokenProvider;
        this.payrollUrl = payrollUrl;
    }

    DashboardStatsDto getStats() {
        List<Employee> employees = employeeClient.getEmployees();
        List<Attendance> today = attendanceRepository.findByDate(LocalDate.now());
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalEmployees((long) employees.size());
        stats.setActiveEmployees(employees.stream().filter(employee -> "ACTIVE".equals(employee.getStatus())).count());
        stats.setOnLeaveCount(employees.stream().filter(employee -> "ON_LEAVE".equals(employee.getStatus())).count());
        stats.setHighAttritionRiskCount(employees.stream().filter(employee -> "HIGH".equalsIgnoreCase(employee.getAttritionRiskLevel())).count());
        stats.setAverageEngagementScore(Math.round(employees.stream()
                .map(Employee::getEngagementScore).filter(score -> score != null)
                .mapToInt(Integer::intValue).average().orElse(82.0) * 10.0) / 10.0);

        long present = today.stream().filter(attendance -> attendance.getStatus() == Attendance.AttendanceStatus.PRESENT
                || attendance.getStatus() == Attendance.AttendanceStatus.REMOTE
                || attendance.getStatus() == Attendance.AttendanceStatus.LATE).count();
        stats.setAttendanceRateToday(employees.isEmpty() ? 94.5 : Math.round((double) present / employees.size() * 100.0 * 10.0) / 10.0);

        Map<String, Long> departments = new HashMap<>();
        employees.stream().map(Employee::getDepartmentName).filter(name -> name != null)
                .forEach(name -> departments.merge(name, 1L, Long::sum));
        stats.setDepartmentDistribution(departments);

        Map<String, Long> attendanceDistribution = new HashMap<>();
        today.forEach(attendance -> attendanceDistribution.merge(attendance.getStatus().name(), 1L, Long::sum));
        stats.setAttendanceStatusDistribution(attendanceDistribution);
        stats.setMonthlyPayrollExpense(payrollExpense());
        return stats;
    }

    private double payrollExpense() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenProvider.generateTokenFromUsername("workforce-service", 60_000, "ROLE_SERVICE", null));
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                payrollUrl + "/payroll/period?payPeriod=March%202026", HttpMethod.GET,
                new HttpEntity<>(headers), new ParameterizedTypeReference<>() {});
        if (response.getBody() == null) {
            return 0.0;
        }
        return response.getBody().stream()
                .map(row -> row.get("netSalary"))
                .filter(Number.class::isInstance)
                .map(Number.class::cast)
                .mapToDouble(Number::doubleValue).sum();
    }
}
