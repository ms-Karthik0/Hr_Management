package com.zidio.nexushr.dto;

import com.zidio.nexushr.model.LeaveRequest.LeaveStatus;

public class LeaveReviewDto {
    private LeaveStatus status;
    private String reviewerComment;
    private String approvedBy;

    public LeaveReviewDto() {}

    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }

    public String getReviewerComment() { return reviewerComment; }
    public void setReviewerComment(String reviewerComment) { this.reviewerComment = reviewerComment; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
}
