package com.zidio.nexushr.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payrolls")
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private String payPeriod; // e.g. "March 2026"

    private Double baseSalary;
    private Double hra;            // House Rent Allowance
    private Double allowances;     // Special allowances
    private Double grossSalary;
    private Double pfDeduction;    // Provident Fund
    private Double taxDeduction;   // TDS / Income Tax
    private Double otherDeduction; // Insurance, Professional Tax
    private Double netSalary;

    @Enumerated(EnumType.STRING)
    private PayrollStatus status = PayrollStatus.PROCESSED;

    private LocalDate paymentDate;
    private String transactionRef;

    public enum PayrollStatus {
        DRAFT, PROCESSED, PAID, FAILED
    }

    public Payroll() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }

    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }

    public Double getHra() { return hra; }
    public void setHra(Double hra) { this.hra = hra; }

    public Double getAllowances() { return allowances; }
    public void setAllowances(Double allowances) { this.allowances = allowances; }

    public Double getGrossSalary() { return grossSalary; }
    public void setGrossSalary(Double grossSalary) { this.grossSalary = grossSalary; }

    public Double getPfDeduction() { return pfDeduction; }
    public void setPfDeduction(Double pfDeduction) { this.pfDeduction = pfDeduction; }

    public Double getTaxDeduction() { return taxDeduction; }
    public void setTaxDeduction(Double taxDeduction) { this.taxDeduction = taxDeduction; }

    public Double getOtherDeduction() { return otherDeduction; }
    public void setOtherDeduction(Double otherDeduction) { this.otherDeduction = otherDeduction; }

    public Double getNetSalary() { return netSalary; }
    public void setNetSalary(Double netSalary) { this.netSalary = netSalary; }

    public PayrollStatus getStatus() { return status; }
    public void setStatus(PayrollStatus status) { this.status = status; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }
}
