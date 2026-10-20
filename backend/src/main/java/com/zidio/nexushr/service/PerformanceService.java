package com.zidio.nexushr.service;

import com.zidio.nexushr.dto.PerformanceReviewDto;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.model.Notification;
import com.zidio.nexushr.model.PerformanceReview;
import com.zidio.nexushr.repository.EmployeeRepository;
import com.zidio.nexushr.repository.PerformanceReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PerformanceService {

    private final PerformanceReviewRepository reviewRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    public PerformanceService(PerformanceReviewRepository reviewRepository,
                              EmployeeRepository employeeRepository,
                              NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.employeeRepository = employeeRepository;
        this.notificationService = notificationService;
    }

    public List<PerformanceReview> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<PerformanceReview> getReviewsByEmployee(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public PerformanceReview submitReview(PerformanceReviewDto dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + dto.getEmployeeId()));

        PerformanceReview review = new PerformanceReview();
        review.setEmployee(employee);
        review.setReviewerName(dto.getReviewerName() != null ? dto.getReviewerName() : "Manager Reviewer");
        review.setCycleYear(dto.getCycleYear() != null ? dto.getCycleYear() : 2026);
        review.setQuarter(dto.getQuarter() != null ? dto.getQuarter() : "Q1");

        double tech = dto.getTechnicalScore() != null ? dto.getTechnicalScore() : 4.0;
        double lead = dto.getLeadershipScore() != null ? dto.getLeadershipScore() : 4.0;
        double del = dto.getDeliveryScore() != null ? dto.getDeliveryScore() : 4.0;
        double overall = Math.round(((tech * 0.40) + (lead * 0.30) + (del * 0.30)) * 10.0) / 10.0;

        review.setTechnicalScore(tech);
        review.setLeadershipScore(lead);
        review.setDeliveryScore(del);
        review.setOverallRating(overall);
        review.setSelfFeedback(dto.getSelfFeedback());
        review.setManagerFeedback(dto.getManagerFeedback());
        review.setGoalsAchievedPercent(dto.getGoalsAchievedPercent() != null ? dto.getGoalsAchievedPercent() : 85);
        review.setStatus(dto.getStatus() != null ? dto.getStatus() : PerformanceReview.ReviewStatus.COMPLETED);
        review.setReviewedAt(LocalDateTime.now());

        PerformanceReview saved = reviewRepository.save(review);

        // Update employee engagement score based on performance
        int newEngagement = Math.min(100, (int) Math.round((overall / 5.0) * 80 + (review.getGoalsAchievedPercent() * 0.2)));
        employee.setEngagementScore(newEngagement);
        employeeRepository.save(employee);

        notificationService.createNotification(
                employee.getEmail(),
                "Performance Review Published - " + review.getQuarter() + " " + review.getCycleYear(),
                "Your appraisal scorecard has been recorded with overall rating: " + overall + " / 5.0.",
                Notification.NotificationType.PERFORMANCE
        );

        return saved;
    }
}
