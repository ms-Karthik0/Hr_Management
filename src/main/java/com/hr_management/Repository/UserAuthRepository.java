package com.hr_management.Repository;

import com.hr_management.Entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth,Long> {
   Optional<UserAuth> findByUserEmail(String userEmail);
}
