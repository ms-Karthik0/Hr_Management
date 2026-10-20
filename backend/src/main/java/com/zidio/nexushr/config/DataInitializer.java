package com.zidio.nexushr.config;

import com.zidio.nexushr.model.*;
import com.zidio.nexushr.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final PerformanceReviewRepository reviewRepository;
    private final AiInsightRepository aiInsightRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           EmployeeRepository employeeRepository,
                           AttendanceRepository attendanceRepository,
                           LeaveRequestRepository leaveRequestRepository,
                           PayrollRepository payrollRepository,
                           PerformanceReviewRepository reviewRepository,
                           AiInsightRepository aiInsightRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
        this.reviewRepository = reviewRepository;
        this.aiInsightRepository = aiInsightRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Create Core Users
        User admin = new User("admin@zidio.com", passwordEncoder.encode("admin123"), "Executive", "Admin", Role.ROLE_ADMIN);
        User hr = new User("hr@zidio.com", passwordEncoder.encode("hr123"), "Sarah", "Jenkins", Role.ROLE_HR_MANAGER);
        User manager = new User("manager@zidio.com", passwordEncoder.encode("manager123"), "David", "Miller", Role.ROLE_MANAGER);
        User employeeUser = new User("alex.turner@zidio.com", passwordEncoder.encode("employee123"), "Alex", "Turner", Role.ROLE_EMPLOYEE);

        userRepository.saveAll(List.of(admin, hr, manager, employeeUser));

        // 2. Create Departments
        Department eng = new Department("Engineering & Technology", "ENG", "Core software development, cloud infrastructure and AI systems", "David Miller", 1250000.0, "San Francisco / Remote");
        Department prd = new Department("Product & UX Design", "PRD", "Product lifecycle, roadmap management and human-centric design", "Elena Rostova", 650000.0, "New York");
        Department hrm = new Department("Human Resources", "HRM", "Talent acquisition, employee welfare, payroll and culture", "Sarah Jenkins", 420000.0, "Chicago");
        Department fin = new Department("Finance & Operations", "FIN", "Corporate accounting, treasury, audits and financial governance", "Marcus Vance", 580000.0, "New York");
        Department mkt = new Department("Sales & Growth", "MKT", "Enterprise client acquisition, branding and customer success", "Rachel Green", 890000.0, "Austin");

        departmentRepository.saveAll(List.of(eng, prd, hrm, fin, mkt));

        // 3. Create Sample Employees
        Employee e1 = createEmployee("EMP-1001", "Alex", "Turner", "alex.turner@zidio.com", "+1 (555) 234-5678", eng, "Senior Full-Stack Engineer", LocalDate.of(2023, 4, 15), 9500.0, "Java 21, Spring Boot, React 19, TypeScript, Docker", 18, 92, "LOW");
        Employee e2 = createEmployee("EMP-1002", "David", "Miller", "manager@zidio.com", "+1 (555) 345-6789", eng, "Engineering Director", LocalDate.of(2021, 2, 1), 14500.0, "System Architecture, Kubernetes, Cloud, Team Leadership", 12, 95, "LOW");
        Employee e3 = createEmployee("EMP-1003", "Sarah", "Jenkins", "hr@zidio.com", "+1 (555) 456-7890", hrm, "Head of People Operations", LocalDate.of(2022, 6, 10), 11000.0, "HR Strategy, Talent Retention, Performance Analytics, Compliance", 15, 90, "LOW");
        Employee e4 = createEmployee("EMP-1004", "Sophia", "Chen", "sophia.chen@zidio.com", "+1 (555) 567-8901", eng, "Cloud Infrastructure Lead", LocalDate.of(2023, 9, 20), 10200.0, "AWS, Terraform, Kubernetes, CI/CD, Go", 68, 62, "HIGH");
        Employee e5 = createEmployee("EMP-1005", "Marcus", "Vance", "marcus.vance@zidio.com", "+1 (555) 678-9012", fin, "VP of Finance", LocalDate.of(2020, 8, 15), 13500.0, "Financial Modeling, Risk Analysis, ERP, Corporate Tax", 22, 88, "LOW");
        Employee e6 = createEmployee("EMP-1006", "Elena", "Rostova", "elena.rostova@zidio.com", "+1 (555) 789-0123", prd, "Principal Product Manager", LocalDate.of(2022, 11, 5), 11800.0, "Product Strategy, User Research, Agile, Analytics", 28, 86, "LOW");
        Employee e7 = createEmployee("EMP-1007", "Liam", "Patel", "liam.patel@zidio.com", "+1 (555) 890-1234", eng, "AI & Data Engineer", LocalDate.of(2024, 1, 10), 8800.0, "Python, PyTorch, Spring AI, Vector DBs, FastAPI", 42, 74, "MEDIUM");
        Employee e8 = createEmployee("EMP-1008", "Jessica", "Taylor", "jessica.taylor@zidio.com", "+1 (555) 901-2345", mkt, "Enterprise Sales Director", LocalDate.of(2022, 3, 1), 12000.0, "B2B Sales, CRM, Pipeline Forecasting, Negotiation", 35, 78, "MEDIUM");
        Employee e9 = createEmployee("EMP-1009", "Noah", "Kim", "noah.kim@zidio.com", "+1 (555) 012-3456", prd, "Lead UI/UX Designer", LocalDate.of(2023, 8, 14), 7800.0, "Figma, Design Systems, shadcn/ui, Tailwind CSS", 72, 58, "HIGH");
        Employee e10 = createEmployee("EMP-1010", "Chloe", "Davis", "chloe.davis@zidio.com", "+1 (555) 123-4567", hrm, "Talent Acquisition Specialist", LocalDate.of(2024, 5, 2), 6200.0, "Technical Recruiting, Employer Branding, Sourcing", 20, 89, "LOW");

        employeeRepository.saveAll(List.of(e1, e2, e3, e4, e5, e6, e7, e8, e9, e10));

        // 4. Initial Attendance for Today
        LocalDate today = LocalDate.now();
        attendanceRepository.save(new Attendance(e1, today, LocalTime.of(9, 2), LocalTime.of(18, 5), 9.0, Attendance.AttendanceStatus.PRESENT, "Main biometric station"));
        attendanceRepository.save(new Attendance(e2, today, LocalTime.of(8, 45), LocalTime.of(17, 30), 8.7, Attendance.AttendanceStatus.PRESENT, "Executive RFID check"));
        attendanceRepository.save(new Attendance(e3, today, LocalTime.of(9, 10), null, null, Attendance.AttendanceStatus.PRESENT, "People ops kiosk"));
        attendanceRepository.save(new Attendance(e4, today, LocalTime.of(10, 5), null, null, Attendance.AttendanceStatus.LATE, "Morning commute delay"));
        attendanceRepository.save(new Attendance(e6, today, LocalTime.of(9, 0), LocalTime.of(17, 45), 8.7, Attendance.AttendanceStatus.REMOTE, "Approved remote Friday"));
        attendanceRepository.save(new Attendance(e7, today, LocalTime.of(9, 15), null, null, Attendance.AttendanceStatus.PRESENT, "Lab entrance"));

        // 5. Initial Leave Requests
        LeaveRequest l1 = new LeaveRequest();
        l1.setEmployee(e4);
        l1.setLeaveType(LeaveRequest.LeaveType.PAID);
        l1.setStartDate(today.plusDays(5));
        l1.setEndDate(today.plusDays(8));
        l1.setDaysCount(4);
        l1.setReason("Annual family recharge & wellness leave");
        l1.setStatus(LeaveRequest.LeaveStatus.PENDING);
        l1.setAppliedOn(LocalDateTime.now().minusHours(4));

        LeaveRequest l2 = new LeaveRequest();
        l2.setEmployee(e1);
        l2.setLeaveType(LeaveRequest.LeaveType.CASUAL);
        l2.setStartDate(today.minusDays(10));
        l2.setEndDate(today.minusDays(9));
        l2.setDaysCount(2);
        l2.setReason("Personal relocation errands");
        l2.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        l2.setApprovedBy("David Miller");
        l2.setReviewerComment("Approved. Coverage arranged.");
        l2.setAppliedOn(LocalDateTime.now().minusDays(12));

        leaveRequestRepository.saveAll(List.of(l1, l2));

        // 6. Initial Payroll Records for "March 2026"
        createPayroll(e1, "March 2026", 9500.0, 3800.0, 1425.0, 1140.0, 1472.0, 150.0);
        createPayroll(e2, "March 2026", 14500.0, 5800.0, 2175.0, 1740.0, 2247.0, 150.0);
        createPayroll(e3, "March 2026", 11000.0, 4400.0, 1650.0, 1320.0, 1705.0, 150.0);
        createPayroll(e4, "March 2026", 10200.0, 4080.0, 1530.0, 1224.0, 1581.0, 150.0);
        createPayroll(e6, "March 2026", 11800.0, 4720.0, 1770.0, 1416.0, 1829.0, 150.0);

        // 7. Initial Performance Reviews (Q1 2026)
        PerformanceReview r1 = new PerformanceReview();
        r1.setEmployee(e1);
        r1.setReviewerName("David Miller");
        r1.setCycleYear(2026);
        r1.setQuarter("Q1");
        r1.setTechnicalScore(4.8);
        r1.setLeadershipScore(4.4);
        r1.setDeliveryScore(4.7);
        r1.setOverallRating(4.7);
        r1.setGoalsAchievedPercent(96);
        r1.setSelfFeedback("Delivered NexusHR architecture with zero latency degradation and complete test coverage.");
        r1.setManagerFeedback("Outstanding technical leadership and proactive mentorship for the junior developers.");
        r1.setStatus(PerformanceReview.ReviewStatus.COMPLETED);
        reviewRepository.save(r1);

        // 8. AI Insights
        AiInsight ai1 = new AiInsight(
                AiInsight.InsightCategory.ATTRITION_RISK,
                "Elevated Flight Risk Detected: Cloud & UX Specialists",
                "Machine learning predictive model flagged Sophia Chen (Cloud Lead) and Noah Kim (UI/UX) with >65% flight probability due to high market salary divergence and lack of role band advancement over 18+ months.",
                AiInsight.ImpactLevel.HIGH,
                "Trigger immediate compensation equity review and discuss career advancement pathways to Staff/Principal level.",
                "High Risk (2 Critical Profiles)"
        );

        AiInsight ai2 = new AiInsight(
                AiInsight.InsightCategory.SKILL_GAP,
                "Critical Engineering Skill Gap: Spring AI & Cloud Native",
                "Automated gap analysis shows current team competency in Spring AI & Vector Databases is 52% against target benchmark of 75% for 2026 roadmap deliverables.",
                AiInsight.ImpactLevel.MEDIUM,
                "Launch internal 4-week cohort training with hands-on lab stipends to bridge target proficiency before Q3 product rollout.",
                "23% Proficiency Deficit"
        );

        AiInsight ai3 = new AiInsight(
                AiInsight.InsightCategory.ENGAGEMENT,
                "Peak Engagement Correlation: Flexible Remote Policy",
                "Teams utilizing hybrid 2-day in-office schedules demonstrated a 14.8% higher engagement score and 22% lower unplanned sick leave frequency.",
                AiInsight.ImpactLevel.LOW,
                "Standardize hybrid guidelines across all engineering and design squads.",
                "88.2% Positive Sentiment Index"
        );

        AiInsight ai4 = new AiInsight(
                AiInsight.InsightCategory.WORKFORCE_OPTIMIZATION,
                "Payroll Run Optimization & Tax Withholding Efficiency",
                "Automated March 2026 payroll run completed with 100% tax compliance verification and zero reconciliation variance.",
                AiInsight.ImpactLevel.LOW,
                "Schedule recurring auto-run on 28th of every month at 23:00 UTC.",
                "Zero Variance Recorded"
        );

        aiInsightRepository.saveAll(List.of(ai1, ai2, ai3, ai4));

        // 9. Initial Notifications
        notificationRepository.save(new Notification("hr@zidio.com", "Leave Application Submitted", "Sophia Chen applied for 4 days of Paid Leave starting in 5 days.", Notification.NotificationType.LEAVE));
        notificationRepository.save(new Notification("alex.turner@zidio.com", "March 2026 Payslip Available", "Your monthly salary of $12,063.00 has been calculated and processed.", Notification.NotificationType.PAYROLL));
        notificationRepository.save(new Notification("admin@zidio.com", "AI Workforce Alert", "Predictive attrition analysis completed for 10 employees. 2 require proactive intervention.", Notification.NotificationType.AI_ALERT));
    }

    private Employee createEmployee(String code, String fn, String ln, String email, String phone, Department dept, String designation, LocalDate joinDate, Double salary, String skills, int attrition, int engagement, String riskLevel) {
        Employee e = new Employee();
        e.setEmployeeCode(code);
        e.setFirstName(fn);
        e.setLastName(ln);
        e.setEmail(email);
        e.setPhone(phone);
        e.setDepartment(dept);
        e.setDesignation(designation);
        e.setJoiningDate(joinDate);
        e.setBaseSalary(salary);
        e.setSkills(skills);
        e.setAttritionRiskScore(attrition);
        e.setEngagementScore(engagement);
        e.setAttritionRiskLevel(riskLevel);
        e.setBankAccountNumber("ACCT-98765" + code.replace("EMP-", ""));
        e.setEmergencyContact("+1 (555) 000-" + code.replace("EMP-", ""));
        return e;
    }

    private void createPayroll(Employee emp, String period, double base, double hra, double allow, double pf, double tax, double other) {
        Payroll p = new Payroll();
        p.setEmployee(emp);
        p.setPayPeriod(period);
        p.setBaseSalary(base);
        p.setHra(hra);
        p.setAllowances(allow);
        p.setGrossSalary(base + hra + allow);
        p.setPfDeduction(pf);
        p.setTaxDeduction(tax);
        p.setOtherDeduction(other);
        p.setNetSalary((base + hra + allow) - (pf + tax + other));
        p.setStatus(Payroll.PayrollStatus.PAID);
        p.setPaymentDate(LocalDate.now());
        p.setTransactionRef("TXN-" + System.currentTimeMillis() % 10000000);
        payrollRepository.save(p);
    }
}
