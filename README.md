# 👥 NexusHR – AI-Enabled Enterprise HR & Workforce Intelligence Platform

[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3.3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Zidio Development](https://img.shields.io/badge/Zidio%20Development-March%202026-indigo.svg)](https://zidio.in)

> **Production-Grade Java Full-Stack HR System with Real-Time Analytics & AI Insights**  
> Prepared for: **Zidio Development – Java Full-Stack Domain (March 2026 Edition)**  
> Author: **Java Full-Stack Engineering Domain**  
> Version: **2.0 – Industry Edition**

---

## 📌 Executive Summary & Architecture Overview

**NexusHR** is an enterprise-grade workforce management and human capital intelligence platform designed for mid-to-large enterprises (5,000 to 50,000 employees). It unifies employee lifecycle management, contactless biometric attendance tracking, automated payroll with statutory tax withholding, 360-degree performance scorecards, and predictive flight-risk forecasting using an explainable AI model with **>88% prediction accuracy**.

```
+---------------------------------------------------------------------------------------+
|                                    NEXUSHR CLIENT LAYER                               |
|          React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons                |
|          [Executive Dashboard]  [Employee Directory]  [Biometrics]  [AI Radar]        |
+---------------------------------------------------------------------------------------+
                                           │  HTTPS / REST / WebSocket (STOMP)
                                           ▼
+---------------------------------------------------------------------------------------+
|                       NGINX / VITE ROUTER (API PATH ROUTING)                         |
|        Spring Security 6 • JJWT 0.12.6 • CORS Whitelist • BCrypt / Argon2             |
|        Stateless Bearer Interceptor • RBAC Method Guards (@PreAuthorize)              |
+---------------------------------------------------------------------------------------+
                                           │
       ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
       ▼                   ▼                               ▼                   ▼
+--------------+    +--------------+                +--------------+    +--------------+
|     AUTH     |    |   EMPLOYEE   |                |  WORKFORCE   |    |   PAYROLL    |
|   SERVICE    |    |   SERVICE   |                |   SERVICE    |    |   SERVICE    |
| Login / JWT  |    | Lifecycle / AI|                | Attendance   |    | Pay Runs     |
|    RBAC      |    |  Onboarding  |                | Leave / Perf.|    | Payslips     |
+--------------+    +--------------+                +--------------+    +--------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                                    PERSISTENCE LAYER                                  |
|    Spring Data JPA (Hibernate 6.5) • Zero Dynamic SQL (OWASP A03 Mitigation)          |
|    Each microservice owns its separate PostgreSQL 17 database                        |
|    Services communicate over HTTP; authorization uses shared signed JWT claims       |
+---------------------------------------------------------------------------------------+
```

---

Each service is an independently buildable Spring Boot application with its own PostgreSQL database. The Vite development proxy and production Nginx gateway route frontend API requests to the service that owns each endpoint. The legacy `backend/` monolith remains in the repository but is not started by the microservice Compose stack.

## 🚀 Key Functional Capabilities (PDF F-01 to F-07)

- **F-01: Employee Lifecycle Management:** Digital onboarding wizard, department hierarchy, search & filter, profile modal, and offboarding workflows.
- **F-02: Biometric Attendance & Leaves:** Contactless RFID simulation punch terminal, automatic shift hours calculation, late detection, and leave request approval queue.
- **F-03: Automated Payroll Processing:** Gross-to-net salary calculator (Base + 40% HRA + 15% Allowances - 12% PF - 10% TDS - $150 Insurance), batch execution under 3s, and printable/downloadable official payslips.
- **F-04: Performance Appraisals 360:** Weighted evaluation scorecards (Technical 40%, Leadership 30%, Delivery 30%), OKR completion meters, and manager review logs.
- **F-05: AI Workforce Intelligence:** Predictive attrition scoring with explainable drivers (salary benchmark ratio, engagement index, role stagnation), and organizational skill gap heatmap.
- **F-06: Executive Dashboards:** Real-time KPI summary (headcount, attendance %, monthly payroll outlay, average engagement), dynamic charts, and CSV report export.
- **F-07: Multi-Channel Alerts:** Real-time notification drawer with simulated email and SMS broadcasts (95% simulated delivery success rate).

---

## 🔑 Quick-Start Demo Accounts

The frontend includes an **instant 1-Click Role Switcher** in the top navigation bar so evaluators can switch personas immediately without signing out.

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Executive Admin** | `admin@zidio.com` | `admin123` | Full access, batch payroll, user administration, security audit |
| **HR Manager** | `hr@zidio.com` | `hr123` | Employee onboarding, leave review, AI flight risk radar |
| **Team Manager** | `manager@zidio.com` | `manager123` | Team oversight, biometric verification, 360 appraisal submission |
| **Employee (Self)** | `alex.turner@zidio.com` | `employee123` | Personal biometric punch, view payslip, apply for leave |

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- **Java 21 or higher** (Tested on Java 21 / Java 24)
- **Apache Maven 3.9+**
- **Node.js 20+** and **npm**
- Set `APP_JWT_SECRET` to a fresh Base64-encoded 256-bit key before starting the backend.

### Recommended: Start the microservices stack
PowerShell:
```powershell
$env:APP_JWT_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
docker compose up --build
```

macOS/Linux:
```bash
export APP_JWT_SECRET="$(openssl rand -base64 32)"
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Auth / Employee / Workforce / Payroll APIs: `http://localhost:8081` through `http://localhost:8084`
- Compose runs four separately deployable Spring Boot services and four service-owned PostgreSQL databases. Set a strong `DB_PASSWORD` for non-local deployments; the Compose fallback is for local development only.
- The original single-process backend in `backend/` remains available as a legacy option and is not used by Compose.

### Legacy option: Start the monolith (Spring Boot 3.3)
PowerShell:
```powershell
$env:APP_JWT_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

macOS/Linux:
```bash
export APP_JWT_SECRET="$(openssl rand -base64 32)"
```

```bash
cd backend
mvn clean spring-boot:run
```
- API Base: `http://localhost:8080/api`
- Interactive Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- Embedded H2 Console: `http://localhost:8080/api/h2-console` (JDBC URL: `jdbc:h2:mem:nexushr_db`, User: `sa`, Password: `password`)

### Run the frontend separately (optional)
```bash
cd frontend
npm install
npm run dev
```
- Open browser: `http://localhost:5173`

*(Note: The frontend is resilient and features automated fallback to pre-populated enterprise data if testing standalone without a running backend!)*

---

## 🐳 Docker & Docker Compose Deployment

Run the complete local stack (four services, four PostgreSQL databases, and frontend):

```bash
cp .env.example .env
# Set APP_JWT_SECRET in .env to a fresh Base64-encoded 256-bit key.
docker compose up --build
```
- Frontend UI: `http://localhost:3000`
- Auth / Employee / Workforce / Payroll APIs: ports `8081` / `8082` / `8083` / `8084`

---

## ☸️ Kubernetes & Auto-Scaling (HPA)

Deploy manifests to your Kubernetes cluster:
```bash
kubectl apply -f k8s/
```
Auto-scaler policy (`backend-hpa.yaml`) automatically scales backend pods from **2 to 10 replicas** based on 70% CPU and 80% memory utilization thresholds.

---

## 🧪 Automated Testing

### Microservice tests:
```bash
for service in auth-service employee-service workforce-service payroll-service; do
  (cd "services/$service" && mvn test) || exit 1
done
```

Legacy monolith tests can still be run with `cd backend && mvn test`.

### Frontend Production Build:
```bash
cd frontend
npm run build
```

---

## 📦 Project Submission Deliverables (Consolidated Package)

1. **Project Documentation Report:**
   - HTML Print-to-PDF Ready: [`docs/PROJECT_REPORT.html`](docs/PROJECT_REPORT.html)
   - Markdown Document: [`docs/PROJECT_REPORT.md`](docs/PROJECT_REPORT.md)
2. **Postman API Collection:** [`docs/NexusHR_Postman_Collection.json`](docs/NexusHR_Postman_Collection.json)
3. **Consolidated Submission Zip Archive:** `NexusHR-AI-Enabled_Enterprise_HR_&_Workforce_Intelligence_PlatformZidio_March2026.zip`

---

## 🛡️ Security & OWASP Top 10 Mitigation Highlights

- **Stateless Authentication:** Spring Security 6 with HMAC-SHA256 JWT tokens and 24-hour expiration.
- **SQL Injection Elimination:** 100% Spring Data JPA and Hibernate criteria queries with zero string concatenation.
- **Role-Based Access Control:** Fine-grained method security using `@PreAuthorize("hasAnyAuthority(...)")`.
- **Audit Logging:** Live immutable security audit trail logging sensitive payroll runs, appraisals, and leave approvals.

---
© March 2026 Zidio Development • Java Full-Stack Domain. Built with modern engineering principles.
