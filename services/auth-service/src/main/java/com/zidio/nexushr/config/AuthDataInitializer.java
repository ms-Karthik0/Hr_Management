package com.zidio.nexushr.config;

import com.zidio.nexushr.model.Role;
import com.zidio.nexushr.model.User;
import com.zidio.nexushr.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuthDataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() != 0) {
            return;
        }

        userRepository.saveAll(List.of(
                createUser("admin@zidio.com", "admin123", "Executive", "Admin", Role.ROLE_ADMIN, null),
                createUser("hr@zidio.com", "hr123", "Sarah", "Jenkins", Role.ROLE_HR_MANAGER, 3L),
                createUser("manager@zidio.com", "manager123", "David", "Miller", Role.ROLE_MANAGER, 2L),
                createUser("alex.turner@zidio.com", "employee123", "Alex", "Turner", Role.ROLE_EMPLOYEE, 1L)
        ));
    }

    private User createUser(String email, String password, String firstName, String lastName, Role role, Long employeeId) {
        User user = new User(email, passwordEncoder.encode(password), firstName, lastName, role);
        user.setEmployeeId(employeeId);
        return user;
    }
}
