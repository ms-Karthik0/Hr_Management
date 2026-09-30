# NexusHR Backend

Spring Boot 3.5 + Java 21 + PostgreSQL backend mapped to the supplied NexusHR UI. The supplied design contains sign-in, admin dashboard, employees/onboarding, attendance & leave, payroll, performance, AI workforce insights, and employee mobile home screens.

## Modules
- JWT authentication + ADMIN / HR / EMPLOYEE authorization
- Employees and onboarding
- Attendance/check-in/check-out records
- Leave requests and approval workflow
- Payroll calculation and monthly records
- Performance reviews
- Holidays
- Admin dashboard metrics
- Rule-based workforce insights endpoint
- PostgreSQL + Flyway migrations
- Swagger/OpenAPI

## Run locally
1. Install Java 21 and Maven 3.9+.
2. Start PostgreSQL: `docker compose up -d postgres`
3. Run: `mvn spring-boot:run`
4. API base: `http://localhost:8080/api`
5. Swagger: `http://localhost:8080/api/swagger-ui/index.html`

## Demo accounts
- Admin: `admin@nexushr.com` / `Admin@123`
- HR: `hr@nexushr.com` / `Hr@12345`

Change these credentials and JWT secret before any non-demo deployment.

## Main endpoints
`POST /api/auth/login`
`GET/POST/PUT /api/employees`
`GET/POST /api/attendance/me`
`GET/POST /api/leaves/me` and `GET/PATCH /api/leaves/pending`
`GET /api/payroll/me`, `GET/POST /api/payroll`
`GET/POST /api/performance/me`
`GET/POST/DELETE /api/holidays`
`GET /api/dashboard` and `/api/dashboard/ai-insights`
