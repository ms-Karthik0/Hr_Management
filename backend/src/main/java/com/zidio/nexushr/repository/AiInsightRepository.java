package com.zidio.nexushr.repository;

import com.zidio.nexushr.model.AiInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiInsightRepository extends JpaRepository<AiInsight, Long> {
    List<AiInsight> findByCategory(AiInsight.InsightCategory category);
    List<AiInsight> findAllByOrderByCreatedAtDesc();
}
