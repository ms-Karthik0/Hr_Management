package com.zidio.nexushr.controller;

import com.zidio.nexushr.model.Notification;
import com.zidio.nexushr.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(notificationService.getAllNotifications());
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(authentication.getName()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    @PostMapping("/internal")
    @PreAuthorize("hasAuthority('ROLE_SERVICE')")
    public ResponseEntity<Notification> createInternalNotification(@RequestBody Notification notification) {
        return ResponseEntity.ok(notificationService.createNotification(
                notification.getRecipientEmail(), notification.getTitle(), notification.getMessage(), notification.getType()));
    }
}
