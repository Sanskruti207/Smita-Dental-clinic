# 🦷 Smita Dental Clinic & Implant Centre - Java Spring Boot Architecture Guide

This comprehensive document explains every single Java file, its architectural responsibility, design patterns, and exact points to present to your mentor.

---

## 🏛️ Overall Architectural Design

The project strictly follows the **Enterprise 4-Tier Layered Architecture** (Industry Standard Spring Boot MVC):

```
Client (Web / Mobile / React / cURL)
        │  HTTP / JSON (RESTful)
        ▼
[1. Controller Layer]   (@RestController) -> Validates requests, maps HTTP verbs, returns DTOs/Entities
        │
        ▼
[2. Service Layer]      (@Service, @Transactional) -> Business logic (chair conflict checks, tax calculations, tooth charting)
        │
        ▼
[3. Repository Layer]   (@Repository) -> Spring Data JPA interfaces generating dynamic SQL via Hibernate
        │
        ▼
[4. Model / Database]   (@Entity) -> Relational database tables (H2 In-Memory / PostgreSQL)
```

### Key Design Patterns Implemented:
1. **MVC Pattern (Model-View-Controller)**: Decouples endpoints, business operations, and persistence.
2. **Repository Pattern**: Abstracts database queries using Spring Data JPA.
3. **Data Transfer Object (DTO) Pattern**: Decouples API contract from internal JPA entity structures.
4. **Dependency Injection & Inversion of Control (IoC)**: Spring Framework manages lifecycle of beans through constructor injection.
5. **Transactional Boundary Pattern**: `@Transactional` ensures atomic database commits and rollbacks on errors.

---

## 📁 File-by-File Breakdown for Your Mentor

### 1. Root & Build Files

| File Name | Purpose | What to Tell Your Mentor |
|---|---|---|
| `pom.xml` | Maven Configuration & Dependencies | Declares Java 17, Spring Boot 3.3.x parent, Spring Web, Spring Data JPA, Spring Security, H2 in-memory DB, PostgreSQL driver, and SpringDoc OpenAPI (Swagger UI). |
| `src/main/resources/application.properties` | App Configuration | Configures port `8080`, database connection URL, JPA Hibernate `ddl-auto=update`, H2 console path, and CORS allowed origins. |
| `src/main/resources/schema.sql` | Relational SQL DDL | Pure relational SQL tables, primary keys, foreign key constraints (e.g. cascade delete on invoice items and prescription medicines), and unique indexes. |

---

### 2. Main Entry Point

| File Name | Package | Purpose & Mentor Talking Points |
|---|---|---|
| `DentalClinicApplication.java` | `com.dentalclinic` | The Spring Boot bootstrap application annotated with `@SpringBootApplication`. Configures global CORS mappings to permit cross-origin requests from web and mobile clients. |

---

### 3. Model Entities (`com.dentalclinic.model`)

These files represent the database tables mapped by Hibernate ORM.

| File Name | Purpose | Key Attributes & Logic |
|---|---|---|
| `UserRole.java` | Enum | Defines system roles: `DOCTOR` and `PATIENT` for Role-Based Access Control. |
| `ToothCondition.java` | Enum | Odontogram status: `HEALTHY`, `CARIES`, `FILLED`, `RCT`, `CROWN`, `MISSING`, `IMPLANT`, `BRIDGE`. |
| `AppointmentStatus.java` | Enum | Lifecycle states: `SCHEDULED`, `CHECKED_IN`, `IN_CHAIR`, `COMPLETED`, `RESCHEDULED`, `CANCELLED`. |
| `PaymentStatus.java` | Enum | Invoicing states: `PAID`, `PARTIAL`, `UNPAID`. |
| `User.java` | JPA Entity (`@Entity`, `@Table(name="users")`) | Stores login credentials, hashed password, role, email, phone, and optional linked `patientId`. |
| `Patient.java` | JPA Entity (`@Entity`, `@Table(name="patients")`) | Comprehensive patient profile: ID code (`SDC-2026-101`), age, gender, medical alerts (`@ElementCollection`), emergency contact, chief complaint, total spent, and balance due. |
| `ToothRecord.java` | JPA Entity (`@Table(name="tooth_records")`) | Represents each tooth (1 to 32 FDI/Universal system) linked to a patient, condition, and doctor notes. |
| `Appointment.java` | JPA Entity (`@Table(name="appointments")`) | Multi-chair dental appointment record. Tracks chair number (1, 2, or 3), doctor name, procedure, date, time, and status. |
| `Invoice.java` | JPA Entity (`@Table(name="invoices")`) | Billing ledger with one-to-many relationship (`@OneToMany`) to `InvoiceItem`. Computes subtotal, tax, discount, grand total, amount paid, and balance due. |
| `InvoiceItem.java` | JPA Entity (`@Table(name="invoice_items")`) | Line items on invoice: procedure description, CDT code, quantity, and unit price. |
| `Prescription.java` | JPA Entity (`@Table(name="prescriptions")`) | Electronic dental prescription with one-to-many relationship to medicines, vitals (BP, pulse, sugar), doctor registration number, and follow-up date. |
| `PrescriptionMedicine.java` | JPA Entity (`@Table(name="prescription_medicines")`) | Drug name, dosage, frequency (e.g. `1-0-1`), duration, and timing (`Before Food` / `After Food`). |
| `ClinicalNote.java` | JPA Entity (`@Table(name="clinical_notes")`) | Per-visit operatory examination notes, periodontal status, and radiographic findings recorded by the doctor. |
| `Notification.java` | JPA Entity (`@Table(name="notifications")`) | Audit log for simulated SMS and email communications dispatched to doctors and patients. |

---

### 4. Data Access Layer / Repositories (`com.dentalclinic.repository`)

Interfaces extending `JpaRepository<T, ID>` providing automated CRUD and query method generation.

| File Name | Key Query Methods & Mentor Points |
|---|---|
| `UserRepository.java` | `findByEmail()`, `existsByEmail()`, `findByPatientId()` for authentication queries. |
| `PatientRepository.java` | `findByPatientIdCode()`, `@Query` search across patient name, phone number, and unique clinic ID. |
| `AppointmentRepository.java` | `findByDateOrderByTimeAsc()`, `findByChairAndDate()`, `findByPatientIdOrderByDateDesc()`. Prevents double booking on the same chair! |
| `ToothRecordRepository.java` | `findByPatientIdOrderByToothNumberAsc()`, `findByPatientIdAndToothNumber()`. Retrieves patient dental chart. |
| `InvoiceRepository.java` | `findByPatientIdOrderByDateDesc()`, `findByStatus()`. Filters unpaid or partial dues. |
| `PrescriptionRepository.java` | `findByPatientIdOrderByDateDesc()`. Loads digital prescription archive. |
| `ClinicalNoteRepository.java` | `findByPatientIdOrderByDateDesc()`. Loads clinical chair history. |
| `NotificationRepository.java` | `findByTargetRoleInOrderByTimestampDesc()`. Role-isolated notification drawer. |

---

### 5. Data Transfer Objects (`com.dentalclinic.dto`)

Objects used to validate input from HTTP requests and return clean API responses.

| File Name | What It Does |
|---|---|
| `AuthRequest.java` / `AuthResponse.java` | Carries login credentials and returns JWT bearer token and user role. |
| `PatientRegistrationDto.java` | Validates new patient demographic fields (`@NotBlank`, `@Email`, `@NotNull`). |
| `AppointmentBookingRequest.java` | Payload for booking chair 1, 2, or 3 on a selected date and time. |
| `AppointmentSlotDto.java` | **Key Feature:** Returns occupied vs free slots across all 3 chairs for any date so patients can see doctor's occupied schedule and select open slots! |
| `InvoiceCreateDto.java` | Allows doctors to generate invoices with multiple procedure line items. |
| `PaymentRecordDto.java` | Collects payment amount, payment method (Cash, UPI, Card), and updates patient balance. |
| `ToothUpdateDto.java` | Updates condition of tooth 1-32 on interactive Odontogram. |

---

### 6. Business Service Layer (`com.dentalclinic.service` & `impl`)

Contains the core business rules, transactional guarantees, and workflow logic.

| File Name | Core Business Logic to Explain |
|---|---|
| `UserServiceImpl.java` | Authenticates users, validates duplicate emails, generates tokens, and creates linked patient profiles upon registration. |
| `PatientServiceImpl.java` | Creates patient profile, assigns sequential ID `SDC-2026-xxx`, and automatically initializes 32 healthy tooth records for their Odontogram. |
| `AppointmentServiceImpl.java` | **Chair Conflict Detection:** Checks if chair 1, 2, or 3 is already occupied at the given time before booking. Calculates daily slot availability for patients. Dispatches SMS confirmation. |
| `BillingServiceImpl.java` | Calculates subtotal, applies discount and GST tax, computes balance due, updates patient ledger, and records partial or full payments. |
| `PrescriptionServiceImpl.java` | Issues electronic Rx with sequential number `RX-2026-xxx`, links medicines, and sends notification to patient. |
| `NotificationServiceImpl.java` | Dispatches SMS and Email alerts filtered by target role (`DOCTOR`, `PATIENT`, `BOTH`). |

---

### 7. REST Controller Layer (`com.dentalclinic.controller`)

Exposes RESTful endpoints conforming to HTTP standards (GET, POST, PUT, PATCH).

| Controller | Endpoints | Responsibility |
|---|---|---|
| `AuthController.java` | `POST /api/auth/login`<br>`POST /api/auth/register` | Authentication and self-registration. |
| `PatientController.java` | `GET /api/patients`<br>`GET /api/patients/{id}`<br>`GET /api/patients/{id}/chart`<br>`PUT /api/patients/{id}/chart/tooth` | Patient directory, search, and 32-tooth Odontogram updates. |
| `AppointmentController.java` | `GET /api/appointments/slots`<br>`GET /api/appointments`<br>`POST /api/appointments/book`<br>`PATCH /api/appointments/{id}/status` | Slot occupancy calculator, booking, and operatory chair status transitions. |
| `BillingController.java` | `GET /api/billing/invoices`<br>`POST /api/billing/invoices`<br>`POST /api/billing/invoices/{id}/pay` | Invoice generation and payment recording. |
| `PrescriptionController.java` | `GET /api/prescriptions/patient/{id}`<br>`POST /api/prescriptions`<br>`GET /api/prescriptions/notes/patient/{id}` | Digital prescriptions and clinical operatory notes. |
| `DoctorScheduleController.java` | `GET /api/doctor/chairs`<br>`GET /api/doctor/notifications` | Chair operatory overview and doctor alerts. |

---

### 8. Security Package (`com.dentalclinic.security`) & Error Handling

| File Name | Purpose & Mentor Explanation |
|---|---|
| `JwtService.java` | Creates and verifies **real signed JWTs** (HS256, secret from `clinic.jwt.secret` / `JWT_SECRET`, 8h expiry). Claims: user id, email, role, patientId. |
| `JwtAuthFilter.java` | Reads `Authorization: Bearer <token>` on every request and puts an `AuthUser` into the Spring `SecurityContext`. |
| `AccessChecker.java` | Ownership rules used in `@PreAuthorize`: the doctor can access everything, a patient only records whose `patientId` equals their own. |
| `GlobalExceptionHandler.java` | One `@RestControllerAdvice` turning exceptions into clean JSON (`400` validation, `403` forbidden, `409` conflict such as a double booking). |

The React frontend (in `src/`) talks to this API through `src/api/client.ts` (adds the token) and `src/api/mappers.ts` (converts server JSON to UI types).

---

### 9. Configuration & Seeds (`com.dentalclinic.config`)

| File Name | Purpose |
|---|---|
| `SecurityConfig.java` | Stateless JWT security: only `/api/auth/login*` and `/api/auth/register` are public, every other `/api/**` call needs a valid token, plus one central CORS configuration and the BCrypt `PasswordEncoder` bean. Role/ownership rules sit on the controllers with `@PreAuthorize`. |
| `DataInitializer.java` | Implements `CommandLineRunner`. Seeds (BCrypt-hashed passwords) initial doctor Dr. Smita Bevle, chairs 1-3, sample patients (Sanskruti Bhosale, Rajesh Sharma), active appointments, dental charts, invoices, and prescriptions upon startup. |

---

## 💡 Top 6 Questions Mentors Ask & How to Answer

### Q1: "How are the frontend and backend connected?"
> **Answer:** The React + TypeScript frontend is a separate app. In development Vite proxies `/api/*` to Spring Boot on port 8080. After login the frontend stores the JWT and sends it as `Authorization: Bearer ...` on every call (`src/api/client.ts`); `ClinicContext.tsx` loads patients, appointments, invoices and prescriptions from the REST API and writes every change back through it. Only simulated SMS notifications and file attachments stay in the browser.

### Q2: "How does the system prevent double-booking on the same dental chair?"
> **Answer:** In `AppointmentServiceImpl.java`, the `bookAppointment()` method executes a conflict query `appointmentRepository.findByChairAndDate()`. If any existing appointment on that chair and date shares the requested time and is not cancelled, it throws an `IllegalStateException`, rejecting the duplicate booking. As a second line of defence the `appointments` table has a UNIQUE `active_slot_key` (`chair|date|time`, set to NULL when cancelled), so even two simultaneous requests cannot both succeed. Furthermore, `getDoctorScheduleSlots()` returns `AppointmentSlotDto` indicating whether each slot is already occupied so patients can clearly see the doctor's busy schedule before booking.

### Q3: "How is the Dental Chart (Odontogram) modeled in the relational database?"
> **Answer:** We have a `ToothRecord` entity mapped to the `tooth_records` table with a composite unique constraint `(patient_id, tooth_number)`. Tooth numbers range from 1 to 32 (FDI / Universal adult notation). When a new patient registers in `PatientServiceImpl.java`, it initializes 32 `ToothRecord` entries with default status `HEALTHY`. When the doctor marks Caries, RCT, or Crown, `updateToothCondition()` updates that specific tooth record.

### Q4: "What design pattern is used between the Controller and the Database?"
> **Answer:** We use the **Repository Pattern** and **Service Layer Pattern**. The Controller delegates to the Service interface (e.g. `AppointmentService`), which encapsulates business rules and transaction boundaries with `@Transactional`. The Service interacts with `AppointmentRepository`, which extends Spring Data JPA's `JpaRepository` to abstract low-level JDBC and SQL generation.

### Q5: "How does Role-Based Access Control (RBAC) work?"
> **Answer:** We use `UserRole` enum (`DOCTOR` vs `PATIENT`). When a user logs in, the `AuthResponse` returns their role and linked profile ID (`patientId`). In `SecurityConfig.java` + `JwtAuthFilter.java` every request is authenticated from the JWT, and controllers use `@PreAuthorize` (for example `hasRole('DOCTOR')` for the patient list, or `@access.canAccessPatient(#patientId)` so a patient can only read their own records). In notifications, the system dispatches alerts targeted specifically to `DOCTOR`, `PATIENT`, or `BOTH`.

### Q6: "How are financial invoices and partial payments tracked?"
> **Answer:** In `Invoice.java`, we maintain `grandTotal`, `amountPaid`, and `balanceDue`. When a payment is recorded via `BillingServiceImpl.recordPayment()`, `amountPaid` is incremented and `balanceDue` is recalculated. If `balanceDue == 0`, status changes to `PAID`; if partially paid, to `PARTIAL`. The patient's running total in `Patient.java` (`balanceDue` and `totalSpent`) is also updated atomically within the same database transaction.
