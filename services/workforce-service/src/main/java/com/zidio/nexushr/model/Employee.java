package com.zidio.nexushr.model;

public class Employee {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String departmentName;
    private String designation;
    private String status;
    private Integer attritionRiskScore;
    private Integer engagementScore;
    private String attritionRiskLevel;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getAttritionRiskScore() { return attritionRiskScore; }
    public void setAttritionRiskScore(Integer attritionRiskScore) { this.attritionRiskScore = attritionRiskScore; }
    public Integer getEngagementScore() { return engagementScore; }
    public void setEngagementScore(Integer engagementScore) { this.engagementScore = engagementScore; }
    public String getAttritionRiskLevel() { return attritionRiskLevel; }
    public void setAttritionRiskLevel(String attritionRiskLevel) { this.attritionRiskLevel = attritionRiskLevel; }
}
