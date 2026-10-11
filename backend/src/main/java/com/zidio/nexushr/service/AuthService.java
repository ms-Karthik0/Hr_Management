package com.zidio.nexushr.service;

import com.zidio.nexushr.config.JwtTokenProvider;
import com.zidio.nexushr.dto.AuthRequest;
import com.zidio.nexushr.dto.AuthResponse;
import com.zidio.nexushr.dto.SignupRequest;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.model.Role;
import com.zidio.nexushr.model.User;
import com.zidio.nexushr.repository.EmployeeRepository;
import com.zidio.nexushr.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       EmployeeRepository employeeRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long employeeId = null;
        Optional<Employee> emp = employeeRepository.findByEmail(request.getEmail());
        if (emp.isPresent()) {
            employeeId = emp.get().getId();
        }

        return new AuthResponse(jwt, refreshToken, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole(), employeeId);
    }

    public AuthResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                request.getRole() != null ? request.getRole() : Role.ROLE_EMPLOYEE
        );

        userRepository.save(user);

        // Auto authenticate after registration
        return authenticate(new AuthRequest(request.getEmail(), request.getPassword()));
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = tokenProvider.getUsernameFromJwt(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newJwt = tokenProvider.generateTokenFromUsername(email, 86400000);
        String newRefreshToken = tokenProvider.generateRefreshToken(email);

        Long employeeId = null;
        Optional<Employee> emp = employeeRepository.findByEmail(email);
        if (emp.isPresent()) {
            employeeId = emp.get().getId();
        }

        return new AuthResponse(newJwt, newRefreshToken, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole(), employeeId);
    }
}
