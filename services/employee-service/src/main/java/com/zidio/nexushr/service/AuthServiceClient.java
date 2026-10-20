package com.zidio.nexushr.service;

import com.zidio.nexushr.model.Employee;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AuthServiceClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String authServiceUrl;

    public AuthServiceClient(@Value("${services.auth.url}") String authServiceUrl) {
        this.authServiceUrl = authServiceUrl;
    }

    public void createEmployeeAccount(Employee employee) {
        Map<String, Object> request = Map.of(
                "email", employee.getEmail(),
                "password", "password123",
                "firstName", employee.getFirstName(),
                "lastName", employee.getLastName(),
                "role", "ROLE_EMPLOYEE",
                "employeeId", employee.getId()
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        restTemplate.postForEntity(authServiceUrl + "/auth/register", new HttpEntity<>(request, headers), Map.class);
    }
}
