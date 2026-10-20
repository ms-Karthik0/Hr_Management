package com.zidio.nexushr.service;

import com.zidio.nexushr.config.JwtTokenProvider;
import com.zidio.nexushr.dto.AuthRequest;
import com.zidio.nexushr.dto.AuthResponse;
import com.zidio.nexushr.dto.SignupRequest;
import com.zidio.nexushr.model.Role;
import com.zidio.nexushr.model.User;
import com.zidio.nexushr.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String authority = user.getRole().name();
        String jwt = tokenProvider.generateTokenFromUsername(user.getEmail(), 86400000, authority, user.getEmployeeId());
        String refreshToken = tokenProvider.generateTokenFromUsername(user.getEmail(), 604800000, authority, user.getEmployeeId());

        return new AuthResponse(jwt, refreshToken, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole(), user.getEmployeeId());
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
        user.setEmployeeId(request.getEmployeeId());

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

        String authority = user.getRole().name();
        String newJwt = tokenProvider.generateTokenFromUsername(email, 86400000, authority, user.getEmployeeId());
        String newRefreshToken = tokenProvider.generateTokenFromUsername(email, 604800000, authority, user.getEmployeeId());

        return new AuthResponse(newJwt, newRefreshToken, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole(), user.getEmployeeId());
    }
}
