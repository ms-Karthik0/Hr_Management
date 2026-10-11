package com.zidio.nexushr.dto;

import com.zidio.nexushr.model.PerformanceReview.ReviewStatus;
import jakarta.validation.constraints.NotNull;

public class PerformanceReviewDto {
    private Long id;

    @NotNull
    private Long employeeId;

    private String reviewerName;
    private Integer cycleYear = 2026;
    private String quarter = "Q1";

    private Double technicalScore;
    private Double leadershipScore;
    private Double deliveryScore;
    private Double overallRating;
    private String selfFeedback;
    private String managerFeedback;
    private Integer goalsAchievedPercent;
    private ReviewStatus status;

    public PerformanceReviewDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

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
}
