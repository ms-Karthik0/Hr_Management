package com.zidio.nexushr.dto;

import java.util.List;

public class AiPredictionResultDto {
    private Long employeeId;
    private String employeeName;
    private String department;
    private String designation;
    private Integer attritionRiskScore;
    private String attritionRiskLevel;
    private Integer engagementScore;
    private List<String> topRiskFactors;
    private List<String> recommendedInterventions;
    private Double confidenceScore;

    public AiPredictionResultDto() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public Integer getAttritionRiskScore() { return attritionRiskScore; }
    public void setAttritionRiskScore(Integer attritionRiskScore) { this.attritionRiskScore = attritionRiskScore; }

    public String getAttritionRiskLevel() { return attritionRiskLevel; }
    public void setAttritionRiskLevel(String attritionRiskLevel) { this.attritionRiskLevel = attritionRiskLevel; }

    public Integer getEngagementScore() { return engagementScore; }
    public void setEngagementScore(Integer engagementScore) { this.engagementScore = engagementScore; }

    public List<String> getTopRiskFactors() { return topRiskFactors; }
    public void setTopRiskFactors(List<String> topRiskFactors) { this.topRiskFactors = topRiskFactors; }

    public List<String> getRecommendedInterventions() { return recommendedInterventions; }
    public void setRecommendedInterventions(List<String> recommendedInterventions) { this.recommendedInterventions = recommendedInterventions; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
}
