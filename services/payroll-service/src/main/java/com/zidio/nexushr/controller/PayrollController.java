package com.zidio.nexushr.controller;

import com.zidio.nexushr.dto.PayrollGenerateDto;
import com.zidio.nexushr.model.Payroll;
import com.zidio.nexushr.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping("/period")
    public ResponseEntity<List<Payroll>> getPayrollByPeriod(@RequestParam(defaultValue = "March 2026") String payPeriod) {
        return ResponseEntity.ok(payrollService.getPayrollByPeriod(payPeriod));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getPayrollByEmployee(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getPayrollById(id));
    }

    @PostMapping("/generate")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR_MANAGER')")
    public ResponseEntity<Payroll> generatePayroll(@Valid @RequestBody PayrollGenerateDto dto) {
        return ResponseEntity.ok(payrollService.generatePayrollForEmployee(dto));
    }

    @PostMapping("/batch-run")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR_MANAGER')")
    public ResponseEntity<List<Payroll>> runBatchPayroll(@RequestParam(defaultValue = "March 2026") String payPeriod) {
        return ResponseEntity.ok(payrollService.runBatchPayroll(payPeriod));
    }

    @PutMapping("/{id}/pay")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR_MANAGER')")
    public ResponseEntity<Payroll> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.markAsPaid(id));
    }
}
