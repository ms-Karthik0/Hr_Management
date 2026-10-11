package com.zidio.nexushr.service;

import com.zidio.nexushr.config.JwtTokenProvider;
import com.zidio.nexushr.model.Payroll;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class NotificationClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final JwtTokenProvider tokenProvider;
    private final String workforceUrl;

    public NotificationClient(JwtTokenProvider tokenProvider,
                              @Value("${services.workforce.url}") String workforceUrl) {
        this.tokenProvider = tokenProvider;
        this.workforceUrl = workforceUrl;
    }

    public void notifyPayrollProcessed(String payPeriod, int employeeCount, double totalPayout) {
        createNotification("admin@zidio.com", "Payroll Run Processed - " + payPeriod,
                "Payroll processed successfully for " + employeeCount + " employees. Total payout: $" + String.format("%.2f", totalPayout));
    }

    public void notifyPayslipDisbursed(Payroll payroll) {
        if (payroll.getEmployee() == null) {
            return;
        }
        createNotification(payroll.getEmployee().getEmail(), "Payslip Disbursed - " + payroll.getPayPeriod(),
                "Your salary of $" + String.format("%.2f", payroll.getNetSalary()) + " for " + payroll.getPayPeriod()
                        + " has been disbursed. Ref: " + payroll.getTransactionRef());
    }

    private void createNotification(String email, String title, String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenProvider.generateTokenFromUsername("payroll-service", 60_000, "ROLE_SERVICE", null));
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> notification = Map.of(
                "recipientEmail", email,
                "title", title,
                "message", message,
                "type", "PAYROLL"
        );
        restTemplate.postForEntity(workforceUrl + "/notifications/internal",
                new HttpEntity<>(notification, headers), Void.class);
    }
}
