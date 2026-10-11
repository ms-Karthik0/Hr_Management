package com.zidio.nexushr.repository;

import com.zidio.nexushr.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
