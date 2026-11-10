-- ===================================================================
-- Smita Dental Clinic Management System - Relational Database Schema
-- DDL for Mentors & Evaluators (Tables, Primary Keys, Foreign Keys, Indexes)
-- ===================================================================

-- 1. Users Table (Doctor & Patient Credentials)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'DOCTOR' or 'PATIENT'
    patient_id VARCHAR(36),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table (Demographics, Medical History, Vitals)
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(36) PRIMARY KEY,
    patient_id_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. SDC-2026-101
    user_id VARCHAR(36),
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    blood_group VARCHAR(10),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(30),
    emergency_contact_relation VARCHAR(50),
    chief_complaint TEXT,
    previous_dental_history TEXT,
    registration_date DATE NOT NULL,
    last_visit_date DATE,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    balance_due DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medical Alerts (Allergies, Systemic Conditions, Medications)
CREATE TABLE IF NOT EXISTS patient_medical_alerts (
    patient_id VARCHAR(36) NOT NULL,
    alert_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 4. Dental Chart / Odontogram (Teeth 1 to 32 FDI/Universal Notation)
CREATE TABLE IF NOT EXISTS tooth_records (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    tooth_number INT NOT NULL, -- 1 to 32
    tooth_condition VARCHAR(30) NOT NULL, -- HEALTHY, CARIES, FILLED, RCT, CROWN, MISSING, IMPLANT, BRIDGE
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT uq_patient_tooth UNIQUE (patient_id, tooth_number)
);

-- 5. Appointments Table (Multi-Chair Operatories 1, 2, 3)
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) PRIMARY KEY,
    appointment_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. APT-2026-081
    patient_id VARCHAR(36) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(30) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL, -- e.g. "10:30 AM"
    duration_minutes INT DEFAULT 30,
    doctor_name VARCHAR(150) NOT NULL DEFAULT 'Dr. Smita Bevle',
    chair_number INT NOT NULL CHECK (chair_number IN (1, 2, 3)),
    procedure_name VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL, -- SCHEDULED, CHECKED_IN, IN_CHAIR, COMPLETED, RESCHEDULED, CANCELLED
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 6. Invoices Table (Financial Billing & Revenue)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. INV-2026-042
    patient_id VARCHAR(36) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(30) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    grand_total DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    balance_due DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PAID', 'PARTIAL', 'UNPAID'
    payment_method VARCHAR(30), -- 'CASH', 'CREDIT_CARD', 'UPI', 'INSURANCE', etc.
    payment_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 7. Invoice Items Table (Line items per treatment)
CREATE TABLE IF NOT EXISTS invoice_items (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL,
    description VARCHAR(255) NOT NULL,
    procedure_code VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- 8. Prescriptions Table (Electronic Rx)
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(36) PRIMARY KEY,
    prescription_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. RX-2026-055
    patient_id VARCHAR(36) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_age INT NOT NULL,
    patient_gender VARCHAR(20) NOT NULL,
    prescription_date DATE NOT NULL,
    doctor_name VARCHAR(150) NOT NULL DEFAULT 'Dr. Smita Bevle',
    doctor_degree VARCHAR(100) DEFAULT 'BDS, MDS (Prosthodontics & Implantology)',
    doctor_reg_no VARCHAR(50) DEFAULT 'MH-DENT-48921',
    diagnosis TEXT NOT NULL,
    bp VARCHAR(20),
    pulse VARCHAR(20),
    sugar VARCHAR(20),
    general_advice TEXT,
    next_follow_up DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 9. Prescription Medicines Table
CREATE TABLE IF NOT EXISTS prescription_medicines (
    id VARCHAR(36) PRIMARY KEY,
    prescription_id VARCHAR(36) NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    strength VARCHAR(50),
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    timing VARCHAR(50) NOT NULL, -- Before Food, After Food, etc.
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

-- 10. Clinical Notes (Doctor Operatory Notes per Visit)
CREATE TABLE IF NOT EXISTS clinical_notes (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    note_date DATE NOT NULL,
    chief_complaint TEXT NOT NULL,
    clinical_examination TEXT NOT NULL,
    periodontal_status VARCHAR(100),
    radiographic_findings TEXT,
    proposed_treatment TEXT NOT NULL,
    chair_number INT,
    attending_doctor VARCHAR(150) NOT NULL DEFAULT 'Dr. Smita Bevle',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 11. Simulated SMS / Email Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'SMS' or 'EMAIL'
    recipient_name VARCHAR(150) NOT NULL,
    recipient_contact VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'DELIVERED',
    patient_id VARCHAR(36),
    target_role VARCHAR(20) NOT NULL -- 'DOCTOR', 'PATIENT', or 'BOTH'
);
