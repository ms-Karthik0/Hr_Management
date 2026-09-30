package com.nexushr.config;

import com.nexushr.entity.Employee;
import com.nexushr.entity.Role;
import com.nexushr.entity.User;
import com.nexushr.repository.EmployeeRepository;
import com.nexushr.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UserRepository r, EmployeeRepository employees, PasswordEncoder p, TransactionTemplate transactions) {
        return args -> transactions.executeWithoutResult(status -> {
            seedUser(r, employees, p, "admin@nexushr.com", "Admin@123", Role.ADMIN, "ADM-1001", "System", "Administrator");
            seedUser(r, employees, p, "hr@nexushr.com", "Hr@12345", Role.HR, "HR-1001", "HR", "Manager");
        });
    }

    private void seedUser(UserRepository users, EmployeeRepository employees, PasswordEncoder passwordEncoder,
                         String email, String password, Role role, String employeeCode, String firstName, String lastName) {
        var user = users.findByEmailIgnoreCase(email).orElseGet(() -> {
            var newUser = new User();
            newUser.setEmail(email);
            newUser.setPasswordHash(passwordEncoder.encode(password));
            newUser.setRole(role);
            return users.save(newUser);
        });

        if (employees.findByUserId(user.getId()).isEmpty()) {
            var employee = new Employee();
            employee.setUser(user);
            employee.setEmployeeCode(employeeCode);
            employee.setFirstName(firstName);
            employee.setLastName(lastName);
            employee.setDepartment(role == Role.ADMIN ? "Administration" : "Human Resources");
            employee.setDesignation(role.name());
            employee.setBasicSalary(BigDecimal.ZERO);
            employee.setOnboardingComplete(true);
            employees.save(employee);
        }
    }
}