package com.zidio.nexushr.controller;

import com.zidio.nexushr.dto.AiPredictionResultDto;
import com.zidio.nexushr.model.AiInsight;
import com.zidio.nexushr.service.AiIntelligenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiInsightsController {

    private final AiIntelligenceService aiIntelligenceService;

    public AiInsightsController(AiIntelligenceService aiIntelligenceService) {
        this.aiIntelligenceService = aiIntelligenceService;
    }

    @GetMapping("/insights")
    public ResponseEntity<List<AiInsight>> getInsights() {
        return ResponseEntity.ok(aiIntelligenceService.getAllInsights());
    }

    @GetMapping("/attrition-predictions")
    public ResponseEntity<List<AiPredictionResultDto>> getAttritionPredictions() {
        return ResponseEntity.ok(aiIntelligenceService.runAttritionAnalysis());
    }

    @GetMapping("/skill-gaps")
    public ResponseEntity<Map<String, Object>> getSkillGaps() {
        return ResponseEntity.ok(aiIntelligenceService.getSkillGapAnalysis());
    }
}
