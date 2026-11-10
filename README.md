# Smita Dental Clinic & Implant Centre: Management System

Full-stack clinic app: **React + TypeScript** (Vite) frontend and **Spring Boot 3 + MySQL** REST backend.
Two portals: **Doctor workstation** (schedule, patients, odontogram, prescriptions, billing) and **Patient portal** (book, records, bills).

## Run it

**1. Backend** (port 8080). Quick demo with the in-memory H2 database, no MySQL needed:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

For MySQL see `MYSQL_SETUP.md`. Set a real signing key outside of demos: `export JWT_SECRET="<at least 32 random characters>"`.

**2. Frontend** (port 3000). Vite proxies `/api/*` to the backend automatically:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Demo logins (seeded on first start):

| Role | Email | Password |
|---|---|---|
| Doctor | `dr.smita@dentalclinic.com` | `doctor123` |
| Patient | `sanskrutiab88@gmail.com` | `patient123` |

API docs (Swagger): http://localhost:8080/swagger-ui.html

## Tests

```bash
mvn test        # backend: auth/security, double-booking, billing maths (H2, no MySQL needed)
npm run lint    # frontend type-check
```

## How it works

- **Auth:** BCrypt-hashed passwords; login returns a signed JWT sent as `Authorization: Bearer <token>`.
- **Access control:** `/api/**` needs a token. Doctor-only endpoints use `@PreAuthorize("hasRole('DOCTOR')")`; patients can only read/book their own records.
- **No double booking:** conflict check in the service **and** a UNIQUE database key on active chair+date+time.
- **Errors:** one `GlobalExceptionHandler` returns `{"error": "..."}` JSON with proper status codes (400/403/409).
- **Frontend data:** `src/context/ClinicContext.tsx` loads everything from the API (`src/api/`). Only simulated SMS notifications and patient file attachments are kept in the browser (no backend endpoint for them yet).

## Project layout

```
src/                 React app (components, context, api, types)
src/main/java/...    Spring Boot (controller, service, repository, model, dto, security, exception, config)
src/test/java/...    JUnit tests
database/            MySQL setup script
```
