package com.zidio.nexushr.service;

import com.zidio.nexushr.model.Notification;
import com.zidio.nexushr.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Notification> getNotificationsForUser(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public Notification createNotification(String recipientEmail, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification(recipientEmail, title, message, type);
        Notification saved = notificationRepository.save(notification);

        // Push via WebSocket to subscribed frontend clients
        try {
            messagingTemplate.convertAndSend("/topic/notifications", saved);
        } catch (Exception ignored) {
            // Silently handle if broker is not connected
        }

        return saved;
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void notifyLeaveApplication(String employeeName, String leaveType, int days) {
        createNotification(
                "hr@zidio.com",
                "New Leave Application",
                employeeName + " applied for " + days + " days of " + leaveType + " leave.",
                Notification.NotificationType.LEAVE
        );
    }

    public void notifyPayrollProcessed(String payPeriod, int employeeCount, double totalPayout) {
        createNotification(
                "admin@zidio.com",
                "Payroll Run Processed - " + payPeriod,
                "Payroll processed successfully for " + employeeCount + " employees. Total payout: $" + String.format("%.2f", totalPayout),
                Notification.NotificationType.PAYROLL
        );
    }
}
