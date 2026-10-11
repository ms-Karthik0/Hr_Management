package com.zidio.nexushr.dto;

import com.zidio.nexushr.model.Role;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Long employeeId;

    public AuthResponse() {}

    public AuthResponse(String token, String refreshToken, String email, String firstName, String lastName, Role role, Long employeeId) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.employeeId = employeeId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
}
