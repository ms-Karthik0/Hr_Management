# NexusHR React Frontend

React 19 + Vite frontend for the NexusHR HR management system. It is designed around the supplied NexusHR UI/UX screens and integrates with the Spring Boot PostgreSQL backend.

## Requirements
- Node.js 20+ (Node 22 recommended)
- NexusHR Spring Boot backend running on `http://localhost:8080`

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## Demo login
- Admin: `admin@nexushr.com` / `Admin@123`
- HR: `hr@nexushr.com` / `Hr@12345`

## API
Set `VITE_API_BASE_URL` in `.env` if your backend is hosted elsewhere. The app sends the JWT returned by `/auth/login` as a Bearer token.

## Main screens
- Sign in
- Admin dashboard
- Employees & onboarding
- Attendance & leave
- Payroll run
- Performance
- AI workforce insights
- Employee mobile/self-service home

## Docker
```bash
docker compose up --build
```
Frontend is served on http://localhost:5173.
