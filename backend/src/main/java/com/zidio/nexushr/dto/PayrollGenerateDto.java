package com.zidio.nexushr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PayrollGenerateDto {
    @NotNull
    private Long employeeId;

    @NotBlank
    private String payPeriod;

    private Double baseSalary;
    private Double hra;
    private Double allowances;
    private Double pfDeduction;
    private Double taxDeduction;
    private Double otherDeduction;

    public PayrollGenerateDto() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getPayPeriod() { return payPeriod; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }

    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }

    public Double getHra() { return hra; }
    public void setHra(Double hra) { this.hra = hra; }

    public Double getAllowances() { return allowances; }
    public void setAllowances(Double allowances) { this.allowances = allowances; }

    public Double getPfDeduction() { return pfDeduction; }
    public void setPfDeduction(Double pfDeduction) { this.pfDeduction = pfDeduction; }

    public Double getTaxDeduction() { return taxDeduction; }
    public void setTaxDeduction(Double taxDeduction) { this.taxDeduction = taxDeduction; }

    public Double getOtherDeduction() { return otherDeduction; }
    public void setOtherDeduction(Double otherDeduction) { this.otherDeduction = otherDeduction; }
}
