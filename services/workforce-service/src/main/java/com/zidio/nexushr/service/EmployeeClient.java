package com.zidio.nexushr.service;

import com.zidio.nexushr.config.JwtTokenProvider;
import com.zidio.nexushr.model.Employee;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.List;

@Component
public class EmployeeClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final JwtTokenProvider tokenProvider;
    private final String employeeServiceUrl;

    public EmployeeClient(JwtTokenProvider tokenProvider,
                          @Value("${services.employee.url}") String employeeServiceUrl) {
        this.tokenProvider = tokenProvider;
        this.employeeServiceUrl = employeeServiceUrl;
    }

    public Employee getEmployee(Long employeeId) {
        return restTemplate.exchange(employeeServiceUrl + "/employees/" + employeeId, HttpMethod.GET,
                new HttpEntity<>(serviceHeaders()), Employee.class).getBody();
    }

    public List<Employee> getEmployees() {
        Employee[] employees = restTemplate.exchange(employeeServiceUrl + "/employees", HttpMethod.GET,
                new HttpEntity<>(serviceHeaders()), Employee[].class).getBody();
        return employees == null ? List.of() : List.of(employees);
    }

    public void updateEngagementScore(Long employeeId, int score) {
        HttpHeaders headers = serviceHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        restTemplate.exchange(employeeServiceUrl + "/employees/" + employeeId + "/engagement",
                HttpMethod.PATCH, new HttpEntity<>(Map.of("engagementScore", score), headers), Employee.class);
    }

    private HttpHeaders serviceHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenProvider.generateTokenFromUsername(
                "workforce-service", 60_000, "ROLE_SERVICE", null));
        return headers;
    }
}
