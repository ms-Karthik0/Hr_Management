# NexusHR

NexusHR is a full-stack human resources application with an employee self-service UI and a role-protected REST API.

## Features

- Employee directory and onboarding
- Attendance and leave requests
- Payroll records
- Performance reviews
- Holiday management
- Dashboard metrics and workforce insights
- JWT authentication with `ADMIN`, `HR`, and `EMPLOYEE` roles

## Technology

- Frontend: React 19, Vite, React Router, Axios
- Backend: Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA
- Database: PostgreSQL 17 with Flyway migrations
- API authentication: JWT bearer tokens

## Requirements

- Docker Desktop with Docker Compose, or a local PostgreSQL 17 instance
- Java 21 and Maven 3.9+ to run the backend outside Docker
- Node.js 20+ and npm to run or build the frontend outside Docker

## Run With Docker

Start PostgreSQL and the backend from the backend directory:

```powershell
cd backend/nexushr-backend
docker compose up --build
```

In a second terminal, start the frontend:

```powershell
cd frontend
docker compose up --build
```

Open the app at [http://localhost:5173](http://localhost:5173). The API is available at [http://localhost:8081/api](http://localhost:8081/api).

To stop either Compose project, press `Ctrl+C`, then run `docker compose down` from that project's directory. PostgreSQL data is stored in the `nexushr_pgdata` volume. Removing it with `docker compose down -v` permanently deletes the database contents.

## Run Locally

Start only PostgreSQL with Docker:

```powershell
cd backend/nexushr-backend
docker compose up -d postgres
```

In another terminal, start the backend. On Windows PowerShell, use the included launcher:

```powershell
cd backend/nexushr-backend
.\run-local.ps1
```

The launcher configures the local database at `localhost:5433` and the API at port `8081`. On other platforms, run `mvn spring-boot:run` from `backend/nexushr-backend`; these are also the application's default local settings.

Start the frontend in a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite serves the frontend at [http://localhost:5173](http://localhost:5173). To use a different API host, set `VITE_API_BASE_URL` before starting or building the frontend. The default is `http://localhost:8081/api`.

Do not run the backend in Docker and through `run-local.ps1` at the same time; both use port `8081`.

## Demo Accounts

- Admin: `admin@nexushr.com` / `Admin@123`
- HR: `hr@nexushr.com` / `Hr@12345`

The backend creates these demo accounts and their employee profiles at startup. These credentials and the default JWT secret are for local development only. Set a strong `JWT_SECRET` and replace demo credentials before deploying anywhere public.

## API

All API routes use the `/api` context path. After login, send the returned token as `Authorization: Bearer <token>` for protected routes.

- `POST /api/auth/login` and `POST /api/auth/register`
- `GET /api/employees`, `GET /api/employees/me`, `GET /api/employees/{id}`, `POST /api/employees`, `PUT /api/employees/{id}`
- `GET /api/attendance/me`, `POST /api/attendance/me`, `POST /api/attendance/employee/{id}`
- `GET /api/leaves/me`, `POST /api/leaves`, `GET /api/leaves/pending`, `PATCH /api/leaves/{id}`
- `GET /api/payroll/me`, `GET /api/payroll?month=YYYY-MM`, `POST /api/payroll/employee/{id}`
- `GET /api/performance/me`, `POST /api/performance/employee/{id}`
- `GET /api/holidays`, `POST /api/holidays`, `DELETE /api/holidays/{id}`
- `GET /api/dashboard`, `GET /api/dashboard/ai-insights`

Interactive API documentation is available at [http://localhost:8081/api/swagger-ui/index.html](http://localhost:8081/api/swagger-ui/index.html). The health endpoint is [http://localhost:8081/api/actuator/health](http://localhost:8081/api/actuator/health).

## Configuration

The backend reads these environment variables; defaults are intended for local development:

- `DB_URL`: `jdbc:postgresql://localhost:5433/nexushr`
- `DB_USERNAME`: `nexushr`
- `DB_PASSWORD`: `nexushr`
- `SERVER_PORT`: `8081`
- `JWT_SECRET`: replace with a long, random secret outside local development
- `JWT_EXPIRATION_MS`: token lifetime in milliseconds; defaults to `86400000`
- `CORS_ALLOWED_ORIGINS`: allowed browser origins; defaults to localhost ports `3000` and `5173`

The frontend reads `VITE_API_BASE_URL` at build/start time and defaults to `http://localhost:8081/api`.

## Project Layout

```text
backend/nexushr-backend/  Spring Boot API, database migration, and backend Compose setup
frontend/                 React application and frontend Compose setup
```

## Build Checks

```powershell
cd backend/nexushr-backend
mvn clean package

cd ../../frontend
npm run build
```
