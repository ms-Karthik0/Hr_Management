package com.zidio.nexushr.config;

import com.zidio.nexushr.model.Payroll;
import com.zidio.nexushr.repository.PayrollRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class PayrollDataInitializer implements CommandLineRunner {
    private final PayrollRepository payrollRepository;

    public PayrollDataInitializer(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    @Override
    public void run(String... args) {
        if (payrollRepository.count() != 0) {
            return;
        }
        payrollRepository.saveAll(List.of(
                payroll(1L, 9500, 3800, 1425, 1140, 1472, 150),
                payroll(2L, 14500, 5800, 2175, 1740, 2247, 150),
                payroll(3L, 11000, 4400, 1650, 1320, 1705, 150),
                payroll(4L, 10200, 4080, 1530, 1224, 1581, 150),
                payroll(6L, 11800, 4720, 1770, 1416, 1829, 150)
        ));
    }

    private Payroll payroll(Long employeeId, double base, double hra, double allowances,
                            double pf, double tax, double other) {
        Payroll payroll = new Payroll();
        payroll.setEmployeeId(employeeId);
        payroll.setPayPeriod("March 2026");
        payroll.setBaseSalary(base);
        payroll.setHra(hra);
        payroll.setAllowances(allowances);
        payroll.setGrossSalary(base + hra + allowances);
        payroll.setPfDeduction(pf);
        payroll.setTaxDeduction(tax);
        payroll.setOtherDeduction(other);
        payroll.setNetSalary((base + hra + allowances) - (pf + tax + other));
        payroll.setStatus(Payroll.PayrollStatus.PAID);
        payroll.setPaymentDate(LocalDate.now());
        payroll.setTransactionRef("TXN-" + employeeId + "-202603");
        return payroll;
    }
}
