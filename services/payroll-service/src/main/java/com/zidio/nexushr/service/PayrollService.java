package com.zidio.nexushr.service;

import com.zidio.nexushr.dto.PayrollGenerateDto;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.model.Payroll;
import com.zidio.nexushr.repository.PayrollRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeClient employeeClient;
    private final NotificationClient notificationClient;

    public PayrollService(PayrollRepository payrollRepository, EmployeeClient employeeClient, NotificationClient notificationClient) {
        this.payrollRepository = payrollRepository;
        this.employeeClient = employeeClient;
        this.notificationClient = notificationClient;
    }

    public List<Payroll> getPayrollByPeriod(String payPeriod) {
        return enrich(payrollRepository.findByPayPeriod(payPeriod));
    }

    public List<Payroll> getPayrollByEmployee(Long employeeId) {
        return enrich(payrollRepository.findByEmployeeId(employeeId));
    }

    public Payroll getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll record not found with id: " + id));
        return enrich(payroll);
    }

    @Transactional
    public Payroll generatePayrollForEmployee(PayrollGenerateDto dto) {
        Employee employee = employeeClient.getEmployee(dto.getEmployeeId());
        if (employee == null) {
            throw new RuntimeException("Employee service returned no employee with id: " + dto.getEmployeeId());
        }

        double base = dto.getBaseSalary() != null ? dto.getBaseSalary() : (employee.getBaseSalary() != null ? employee.getBaseSalary() : 6000.0);
        double hra = dto.getHra() != null ? dto.getHra() : Math.round(base * 0.40 * 100.0) / 100.0;
        double allowances = dto.getAllowances() != null ? dto.getAllowances() : Math.round(base * 0.15 * 100.0) / 100.0;
        double gross = base + hra + allowances;

        double pf = dto.getPfDeduction() != null ? dto.getPfDeduction() : Math.round(base * 0.12 * 100.0) / 100.0;
        double tax = dto.getTaxDeduction() != null ? dto.getTaxDeduction() : Math.round(gross * 0.10 * 100.0) / 100.0; // TDS
        double other = dto.getOtherDeduction() != null ? dto.getOtherDeduction() : 150.0; // Medical & Insurance
        double net = gross - (pf + tax + other);

        Payroll payroll = payrollRepository.findByEmployeeIdAndPayPeriod(employee.getId(), dto.getPayPeriod())
                .orElse(new Payroll());

        payroll.setEmployeeId(employee.getId());
        payroll.setPayPeriod(dto.getPayPeriod());
        payroll.setBaseSalary(base);
        payroll.setHra(hra);
        payroll.setAllowances(allowances);
        payroll.setGrossSalary(gross);
        payroll.setPfDeduction(pf);
        payroll.setTaxDeduction(tax);
        payroll.setOtherDeduction(other);
        payroll.setNetSalary(net);
        payroll.setStatus(Payroll.PayrollStatus.PROCESSED);
        payroll.setPaymentDate(LocalDate.now());
        payroll.setTransactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Payroll saved = payrollRepository.save(payroll);
        saved.setEmployee(employee);
        return saved;
    }

    @Transactional
    public List<Payroll> runBatchPayroll(String payPeriod) {
        List<Employee> activeEmployees = employeeClient.getEmployees().stream()
                .filter(employee -> "ACTIVE".equals(employee.getStatus()))
                .toList();
        List<Payroll> results = new ArrayList<>();
        double totalExpense = 0;

        for (Employee emp : activeEmployees) {
            PayrollGenerateDto dto = new PayrollGenerateDto();
            dto.setEmployeeId(emp.getId());
            dto.setPayPeriod(payPeriod);
            Payroll p = generatePayrollForEmployee(dto);
            results.add(p);
            totalExpense += p.getNetSalary();
        }

        notificationClient.notifyPayrollProcessed(payPeriod, results.size(), totalExpense);
        return results;
    }

    @Transactional
    public Payroll markAsPaid(Long payrollId) {
        Payroll payroll = getPayrollById(payrollId);
        payroll.setStatus(Payroll.PayrollStatus.PAID);
        payroll.setPaymentDate(LocalDate.now());
        if (payroll.getTransactionRef() == null) {
            payroll.setTransactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        Payroll updated = payrollRepository.save(payroll);
        updated.setEmployee(employeeClient.getEmployee(updated.getEmployeeId()));
        notificationClient.notifyPayslipDisbursed(updated);
        return updated;
    }

    private List<Payroll> enrich(List<Payroll> payrolls) {
        payrolls.forEach(this::enrich);
        return payrolls;
    }

    private Payroll enrich(Payroll payroll) {
        payroll.setEmployee(employeeClient.getEmployee(payroll.getEmployeeId()));
        return payroll;
    }
}
