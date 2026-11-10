export type UserRole = 'doctor' | 'patient';

/** Result returned by login(): success flag plus a user-facing reason when it fails. */
export interface LoginResult {
  success: boolean;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  patientId?: string; // Linked patient profile if role === 'patient'
  avatarUrl?: string;
}

export type ToothCondition = 'healthy' | 'caries' | 'filled' | 'rct' | 'crown' | 'missing' | 'implant' | 'bridge';

export interface PatientFile {
  id: string;
  patientId: string;
  name: string;
  category: 'X-Ray OPG' | 'X-Ray IOPA' | 'CBCT 3D' | 'Lab Report' | 'Clinical Photo' | 'Treatment Plan PDF';
  date: string;
  size: string;
  url: string;
  notes?: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Bedtime';
  instructions?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  doctorName: string; // Dr. Smita Bevle
  doctorDegree: string;
  doctorRegNo: string;
  diagnosis: string;
  vitals?: {
    bp?: string;
    pulse?: string;
    sugar?: string;
  };
  medicines: PrescriptionMedicine[];
  generalAdvice: string;
  nextFollowUp: string;
  toothNumbers?: number[];
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  chiefComplaint: string;
  clinicalExamination: string;
  periodontalStatus?: string;
  radiographicFindings?: string;
  proposedTreatment: string;
  chairNumber?: number;
  attendingDoctor: string; // Dr. Smita Bevle
  toothNumbers?: number[];
}

export interface PatientRegistrationInput {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  password: string;
  address: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  medicalAlerts: string[];
  chiefComplaint: string;
  previousDentalHistory?: string;
}

export interface Patient {
  id: string;
  patientIdCode: string; // e.g. "SDC-2026-101"
  userId?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalAlerts: string[];
  chiefComplaint: string;
  previousDentalHistory?: string;
  registrationDate: string;
  lastVisitDate?: string;
  totalSpent: number;
  balanceDue: number;
  dentalChart: Record<number, ToothCondition>;
  notesHistory: ClinicalNote[];
  files: PatientFile[];
}

export type AppointmentStatus = 'scheduled' | 'checked-in' | 'in-chair' | 'completed' | 'rescheduled' | 'cancelled';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  durationMinutes: number;
  doctor: string; // Dr. Smita Bevle
  chair: 1 | 2 | 3;
  procedure: string;
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';
export type PaymentMethod = 'cash' | 'credit-card' | 'debit-card' | 'upi' | 'insurance' | 'bank-transfer';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentNotes?: string;
}

export interface SimulatedNotification {
  id: string;
  type: 'sms' | 'email';
  recipientName: string;
  recipientContact: string;
  title: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered';
  patientId?: string;
  targetRole?: 'doctor' | 'patient' | 'both';
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export type DoctorTabId = 'dr-schedule' | 'dr-patients' | 'dr-billing' | 'dr-analytics';
export type PatientTabId = 'patient-dashboard' | 'patient-book' | 'patient-records' | 'patient-billing';
