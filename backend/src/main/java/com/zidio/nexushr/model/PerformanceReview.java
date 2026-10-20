package com.zidio.nexushr.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_reviews")
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private String reviewerName;
    private Integer cycleYear = 2026;
    private String quarter = "Q1";

    private Double technicalScore;
    private Double leadershipScore;
    private Double deliveryScore;
    private Double overallRating;

    @Column(length = 2000)
    private String selfFeedback;

    @Column(length = 2000)
    private String managerFeedback;

    private Integer goalsAchievedPercent; // 0 - 100

    @Enumerated(EnumType.STRING)
    private ReviewStatus status = ReviewStatus.COMPLETED;

    private LocalDateTime reviewedAt = LocalDateTime.now();

    public enum ReviewStatus {
        PENDING_SELF, PENDING_MANAGER, COMPLETED
    }

    public PerformanceReview() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public Integer getCycleYear() { return cycleYear; }
    public void setCycleYear(Integer cycleYear) { this.cycleYear = cycleYear; }

    public String getQuarter() { return quarter; }
    public void setQuarter(String quarter) { this.quarter = quarter; }

    public Double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }

    public Double getLeadershipScore() { return leadershipScore; }
    public void setLeadershipScore(Double leadershipScore) { this.leadershipScore = leadershipScore; }

    public Double getDeliveryScore() { return deliveryScore; }
    public void setDeliveryScore(Double deliveryScore) { this.deliveryScore = deliveryScore; }

    public Double getOverallRating() { return overallRating; }
    public void setOverallRating(Double overallRating) { this.overallRating = overallRating; }

    public String getSelfFeedback() { return selfFeedback; }
    public void setSelfFeedback(String selfFeedback) { this.selfFeedback = selfFeedback; }

    public String getManagerFeedback() { return managerFeedback; }
    public void setManagerFeedback(String managerFeedback) { this.managerFeedback = managerFeedback; }

    public Integer getGoalsAchievedPercent() { return goalsAchievedPercent; }
    public void setGoalsAchievedPercent(Integer goalsAchievedPercent) { this.goalsAchievedPercent = goalsAchievedPercent; }

    public ReviewStatus getStatus() { return status; }
    public void setStatus(ReviewStatus status) { this.status = status; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
