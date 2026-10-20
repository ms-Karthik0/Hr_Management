package com.zidio.nexushr.controller;

import com.zidio.nexushr.dto.LeaveApplyDto;
import com.zidio.nexushr.dto.LeaveReviewDto;
import com.zidio.nexushr.model.LeaveRequest;
import com.zidio.nexushr.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaves(@RequestParam(required = false) LeaveRequest.LeaveStatus status) {
        if (status != null) {
            return ResponseEntity.ok(leaveService.getLeavesByStatus(status));
        }
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeavesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployee(employeeId));
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> applyLeave(@Valid @RequestBody LeaveApplyDto dto) {
        return ResponseEntity.ok(leaveService.applyLeave(dto));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_MANAGER')")
    public ResponseEntity<LeaveRequest> reviewLeave(@PathVariable Long id, @RequestBody LeaveReviewDto dto) {
        return ResponseEntity.ok(leaveService.reviewLeave(id, dto));
    }
}
