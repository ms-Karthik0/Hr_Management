package com.zidio.nexushr.controller;

import com.zidio.nexushr.dto.PerformanceReviewDto;
import com.zidio.nexushr.model.PerformanceReview;
import com.zidio.nexushr.service.PerformanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @GetMapping
    public ResponseEntity<List<PerformanceReview>> getAllReviews() {
        return ResponseEntity.ok(performanceService.getAllReviews());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PerformanceReview>> getReviewsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(performanceService.getReviewsByEmployee(employeeId));
    }

    @PostMapping("/review")
    public ResponseEntity<PerformanceReview> submitReview(@Valid @RequestBody PerformanceReviewDto dto) {
        return ResponseEntity.ok(performanceService.submitReview(dto));
    }
}
