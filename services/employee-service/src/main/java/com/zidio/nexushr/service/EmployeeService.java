package com.zidio.nexushr.service;

import com.zidio.nexushr.dto.EmployeeDto;
import com.zidio.nexushr.model.Department;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.repository.DepartmentRepository;
import com.zidio.nexushr.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AuthServiceClient authServiceClient;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           AuthServiceClient authServiceClient) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.authServiceClient = authServiceClient;
    }

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return mapToDto(employee);
    }

    public EmployeeDto getEmployeeByEmail(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found with email: " + email));
        return mapToDto(employee);
    }

    public List<EmployeeDto> searchEmployees(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllEmployees();
        }
        return employeeRepository.searchEmployees(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        Employee employee = new Employee();
        mapFromDto(dto, employee);

        if (employee.getEmployeeCode() == null || employee.getEmployeeCode().isEmpty()) {
            employee.setEmployeeCode("EMP-" + (1000 + employeeRepository.count() + 1));
        }

        if (employee.getJoiningDate() == null) {
            employee.setJoiningDate(LocalDate.now());
        }

        Employee saved = employeeRepository.save(employee);

        authServiceClient.createEmployeeAccount(saved);

        return mapToDto(saved);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        mapFromDto(dto, employee);
        Employee updated = employeeRepository.save(employee);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Transactional
    public EmployeeDto updateStatus(Long id, Employee.EmployeeStatus status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employee.setStatus(status);
        return mapToDto(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeDto updateEngagementScore(Long id, Integer score) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employee.setEngagementScore(score);
        return mapToDto(employeeRepository.save(employee));
    }

    public EmployeeDto mapToDto(Employee emp) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(emp.getId());
        dto.setEmployeeCode(emp.getEmployeeCode());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setEmail(emp.getEmail());
        dto.setPhone(emp.getPhone());
        if (emp.getDepartment() != null) {
            dto.setDepartmentId(emp.getDepartment().getId());
            dto.setDepartmentName(emp.getDepartment().getName());
        }
        dto.setDesignation(emp.getDesignation());
        dto.setJoiningDate(emp.getJoiningDate());
        dto.setEmploymentType(emp.getEmploymentType());
        dto.setStatus(emp.getStatus());
        dto.setBaseSalary(emp.getBaseSalary());
        dto.setBankAccountNumber(emp.getBankAccountNumber());
        dto.setEmergencyContact(emp.getEmergencyContact());
        dto.setSkills(emp.getSkills());
        dto.setAttritionRiskScore(emp.getAttritionRiskScore());
        dto.setEngagementScore(emp.getEngagementScore());
        dto.setAttritionRiskLevel(emp.getAttritionRiskLevel());
        return dto;
    }

    private void mapFromDto(EmployeeDto dto, Employee emp) {
        if (dto.getEmployeeCode() != null) emp.setEmployeeCode(dto.getEmployeeCode());
        emp.setFirstName(dto.getFirstName());
        emp.setLastName(dto.getLastName());
        emp.setEmail(dto.getEmail());
        emp.setPhone(dto.getPhone());
        emp.setDesignation(dto.getDesignation());
        if (dto.getJoiningDate() != null) emp.setJoiningDate(dto.getJoiningDate());
        if (dto.getEmploymentType() != null) emp.setEmploymentType(dto.getEmploymentType());
        if (dto.getStatus() != null) emp.setStatus(dto.getStatus());
        emp.setBaseSalary(dto.getBaseSalary());
        emp.setBankAccountNumber(dto.getBankAccountNumber());
        emp.setEmergencyContact(dto.getEmergencyContact());
        emp.setSkills(dto.getSkills());

        if (dto.getAttritionRiskScore() != null) {
            emp.setAttritionRiskScore(dto.getAttritionRiskScore());
            if (dto.getAttritionRiskScore() >= 65) emp.setAttritionRiskLevel("HIGH");
            else if (dto.getAttritionRiskScore() >= 35) emp.setAttritionRiskLevel("MEDIUM");
            else emp.setAttritionRiskLevel("LOW");
        }

        if (dto.getEngagementScore() != null) emp.setEngagementScore(dto.getEngagementScore());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElse(null);
            emp.setDepartment(dept);
        }
    }
}
