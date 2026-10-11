package com.zidio.nexushr.repository;

import com.zidio.nexushr.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByPayPeriod(String payPeriod);
    List<Payroll> findByEmployeeId(Long employeeId);
    Optional<Payroll> findByEmployeeIdAndPayPeriod(Long employeeId, String payPeriod);

    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.payPeriod = :payPeriod")
    Double sumNetSalaryForPayPeriod(String payPeriod);
}
