package com.zidio.nexushr.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_insights")
public class AiInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InsightCategory category;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private ImpactLevel impactLevel = ImpactLevel.MEDIUM;

    @Column(length = 2000)
    private String recommendation;

    private String metricValue; // e.g. "87% Retention Probability", "High Attrition Risk in Frontend Team"

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum InsightCategory {
        ATTRITION_RISK, SKILL_GAP, WORKFORCE_OPTIMIZATION, ENGAGEMENT
    }

    public enum ImpactLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public AiInsight() {}

    public AiInsight(InsightCategory category, String title, String description, ImpactLevel impactLevel, String recommendation, String metricValue) {
        this.category = category;
        this.title = title;
        this.description = description;
        this.impactLevel = impactLevel;
        this.recommendation = recommendation;
        this.metricValue = metricValue;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InsightCategory getCategory() { return category; }
    public void setCategory(InsightCategory category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ImpactLevel getImpactLevel() { return impactLevel; }
    public void setImpactLevel(ImpactLevel impactLevel) { this.impactLevel = impactLevel; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getMetricValue() { return metricValue; }
    public void setMetricValue(String metricValue) { this.metricValue = metricValue; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
