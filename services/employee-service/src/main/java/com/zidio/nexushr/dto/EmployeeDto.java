package com.zidio.nexushr.dto;

import com.zidio.nexushr.model.Employee.EmployeeStatus;
import com.zidio.nexushr.model.Employee.EmploymentType;
import java.time.LocalDate;

public class EmployeeDto {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private LocalDate joiningDate;
    private EmploymentType employmentType;
    private EmployeeStatus status;
    private Double baseSalary;
    private String bankAccountNumber;
    private String emergencyContact;
    private String skills;
    private Integer attritionRiskScore;
    private Integer engagementScore;
    private String attritionRiskLevel;

    public EmployeeDto() {}

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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

    public EmployeeStatus getStatus() { return status; }
    public void setStatus(EmployeeStatus status) { this.status = status; }

    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public Integer getAttritionRiskScore() { return attritionRiskScore; }
    public void setAttritionRiskScore(Integer attritionRiskScore) { this.attritionRiskScore = attritionRiskScore; }

    public Integer getEngagementScore() { return engagementScore; }
    public void setEngagementScore(Integer engagementScore) { this.engagementScore = engagementScore; }

    public String getAttritionRiskLevel() { return attritionRiskLevel; }
    public void setAttritionRiskLevel(String attritionRiskLevel) { this.attritionRiskLevel = attritionRiskLevel; }
}
