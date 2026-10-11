package com.zidio.nexushr;

import com.zidio.nexushr.dto.AiPredictionResultDto;
import com.zidio.nexushr.model.Department;
import com.zidio.nexushr.model.Employee;
import com.zidio.nexushr.repository.AiInsightRepository;
import com.zidio.nexushr.repository.EmployeeRepository;
import com.zidio.nexushr.service.AiIntelligenceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AiIntelligenceServiceTest {

    private EmployeeRepository employeeRepository;
    private AiInsightRepository aiInsightRepository;
    private AiIntelligenceService aiService;

    @BeforeEach
    void setUp() {
        employeeRepository = Mockito.mock(EmployeeRepository.class);
        aiInsightRepository = Mockito.mock(AiInsightRepository.class);
        aiService = new AiIntelligenceService(employeeRepository, aiInsightRepository);
    }

    @Test
    void testPredictEmployeeAttritionHighRisk() {
        Department dept = new Department("Engineering", "ENG", "Core tech", "David", 100000.0, "SF");
        Employee emp = new Employee();
        emp.setId(10L);
        emp.setFirstName("Sophia");
        emp.setLastName("Chen");
        emp.setDepartment(dept);
        emp.setDesignation("Cloud Architect");
        emp.setJoiningDate(LocalDate.now().minusYears(3));
        emp.setBaseSalary(5800.0);
        emp.setSkills("AWS, Kubernetes, Go");
        emp.setEngagementScore(45); // Low engagement

        AiPredictionResultDto result = aiService.predictEmployeeAttrition(emp);

        assertNotNull(result);
        assertEquals("HIGH", result.getAttritionRiskLevel());
        assertTrue(result.getAttritionRiskScore() >= 65);
        assertTrue(result.getConfidenceScore() >= 80.0);
        assertFalse(result.getTopRiskFactors().isEmpty());
        assertFalse(result.getRecommendedInterventions().isEmpty());
    }

    @Test
    void testSkillGapAnalysis() {
        Map<String, Object> analysis = aiService.getSkillGapAnalysis();
        assertNotNull(analysis);
        assertTrue(analysis.containsKey("skills"));
        assertTrue(analysis.containsKey("overallReadiness"));
    }
}
