package com.hr_management.Entity;

import com.hr_management.ENUM.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="user_auth")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAuth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String userName;
    @Column(nullable = false,unique = true)
    private String userEmail;
    @Column(nullable = false)
    private String password;
    @Column
    private String phone;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column
    private String department;
}
