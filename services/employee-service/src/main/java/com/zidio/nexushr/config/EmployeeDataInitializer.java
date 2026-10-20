package com.zidio.nexushr.config;

import com.zidio.nexushr.model.Department;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.repository.DepartmentRepository;
import com.zidio.nexushr.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class EmployeeDataInitializer implements CommandLineRunner {
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public EmployeeDataInitializer(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.count() != 0) {
            return;
        }

        Department engineering = new Department("Engineering & Technology", "ENG", "Core software development, cloud infrastructure and AI systems", "David Miller", 1250000.0, "San Francisco / Remote");
        Department product = new Department("Product & UX Design", "PRD", "Product lifecycle, roadmap management and human-centric design", "Elena Rostova", 650000.0, "New York");
        Department hr = new Department("Human Resources", "HRM", "Talent acquisition, employee welfare, payroll and culture", "Sarah Jenkins", 420000.0, "Chicago");
        Department finance = new Department("Finance & Operations", "FIN", "Corporate accounting, treasury, audits and financial governance", "Marcus Vance", 580000.0, "New York");
        Department sales = new Department("Sales & Growth", "MKT", "Enterprise client acquisition, branding and customer success", "Rachel Green", 890000.0, "Austin");
        departmentRepository.saveAll(List.of(engineering, product, hr, finance, sales));

        employeeRepository.saveAll(List.of(
                employee("EMP-1001", "Alex", "Turner", "alex.turner@zidio.com", engineering, "Senior Full-Stack Engineer", "Java 21, Spring Boot, React 19, TypeScript, Docker", 9500, 18, 92),
                employee("EMP-1002", "David", "Miller", "manager@zidio.com", engineering, "Engineering Director", "System Architecture, Kubernetes, Cloud, Team Leadership", 14500, 12, 95),
                employee("EMP-1003", "Sarah", "Jenkins", "hr@zidio.com", hr, "Head of People Operations", "HR Strategy, Talent Retention, Performance Analytics, Compliance", 11000, 15, 90),
                employee("EMP-1004", "Sophia", "Chen", "sophia.chen@zidio.com", engineering, "Cloud Infrastructure Lead", "AWS, Terraform, Kubernetes, CI/CD, Go", 10200, 68, 62),
                employee("EMP-1005", "Marcus", "Vance", "marcus.vance@zidio.com", finance, "VP of Finance", "Financial Modeling, Risk Analysis, ERP, Corporate Tax", 13500, 22, 88),
                employee("EMP-1006", "Elena", "Rostova", "elena.rostova@zidio.com", product, "Principal Product Manager", "Product Strategy, User Research, Agile, Analytics", 11800, 28, 86),
                employee("EMP-1007", "Liam", "Patel", "liam.patel@zidio.com", engineering, "AI & Data Engineer", "Python, PyTorch, Spring AI, Vector DBs, FastAPI", 8800, 42, 74),
                employee("EMP-1008", "Jessica", "Taylor", "jessica.taylor@zidio.com", sales, "Enterprise Sales Director", "B2B Sales, CRM, Pipeline Forecasting, Negotiation", 12000, 35, 78),
                employee("EMP-1009", "Noah", "Kim", "noah.kim@zidio.com", product, "Lead UI/UX Designer", "Figma, Design Systems, shadcn/ui, Tailwind CSS", 7800, 72, 58),
                employee("EMP-1010", "Chloe", "Davis", "chloe.davis@zidio.com", hr, "Talent Acquisition Specialist", "Technical Recruiting, Employer Branding, Sourcing", 6200, 20, 89)
        ));
    }

    private Employee employee(String code, String firstName, String lastName, String email, Department department,
                              String designation, String skills, double salary, int risk, int engagement) {
        Employee employee = new Employee();
        employee.setEmployeeCode(code);
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setPhone("+1 (555) 234-0000");
        employee.setDepartment(department);
        employee.setDesignation(designation);
        employee.setJoiningDate(LocalDate.of(2023, 4, 15));
        employee.setBaseSalary(salary);
        employee.setSkills(skills);
        employee.setAttritionRiskScore(risk);
        employee.setAttritionRiskLevel(risk >= 65 ? "HIGH" : risk >= 35 ? "MEDIUM" : "LOW");
        employee.setEngagementScore(engagement);
        return employee;
    }
}
