/**
 * Converts between the backend's JSON (enums in UPPER_CASE, flat emergency-contact fields, vitals as bp/pulse/sugar ...)
 * and the shapes the React components already use (lower-case enums, nested objects ...).
 */
import {
  Appointment,
  AppointmentStatus,
  ClinicalNote,
  Invoice,
  PaymentMethod,
  PaymentStatus,
  Patient,
  Prescription,
  PrescriptionMedicine,
  ToothCondition,
  User
} from '../types/clinic';
import { getDefaultToothChart } from '../data/mockData';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Api = any; // server JSON; validated by the mapping functions below

const lower = (s: string | null | undefined) => (s ?? '').toLowerCase();

export const toApiStatus = (s: AppointmentStatus): string => s.toUpperCase().replace(/-/g, '_');
const fromApiStatus = (s: string): AppointmentStatus => lower(s).replace(/_/g, '-') as AppointmentStatus;

export function mapUser(u: Api): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone ?? '',
    role: lower(u.role) as User['role'],
    patientId: u.patientId ?? undefined,
    avatarUrl: u.avatarUrl ?? undefined
  };
}

export function mapNote(n: Api): ClinicalNote {
  return {
    id: n.id,
    patientId: n.patientId,
    date: n.date,
    chiefComplaint: n.chiefComplaint ?? '',
    clinicalExamination: n.clinicalExamination ?? '',
    periodontalStatus: n.periodontalStatus ?? undefined,
    radiographicFindings: n.radiographicFindings ?? undefined,
    proposedTreatment: n.proposedTreatment ?? '',
    chairNumber: n.chairNumber ?? undefined,
    attendingDoctor: n.attendingDoctor ?? 'Dr. Smita Bevle'
  };
}

export function mapChart(records: Api[] | undefined): Record<number, ToothCondition> {
  const chart = getDefaultToothChart();
  (records ?? []).forEach((r) => {
    chart[r.toothNumber] = lower(r.condition) as ToothCondition;
  });
  return chart;
}

export function mapPatient(p: Api, chart?: Api[], notes?: Api[], files: Patient['files'] = []): Patient {
  return {
    id: p.id,
    patientIdCode: p.patientIdCode,
    userId: p.userId ?? undefined,
    name: p.name,
    age: Number(p.age ?? 0),
    gender: p.gender,
    phone: p.phone ?? '',
    email: p.email ?? '',
    address: p.address ?? '',
    bloodGroup: p.bloodGroup ?? '',
    emergencyContact: {
      name: p.emergencyContactName ?? '',
      phone: p.emergencyContactPhone ?? '',
      relation: p.emergencyContactRelation ?? ''
    },
    medicalAlerts: p.medicalAlerts ?? [],
    chiefComplaint: p.chiefComplaint ?? '',
    previousDentalHistory: p.previousDentalHistory ?? undefined,
    registrationDate: p.registrationDate,
    lastVisitDate: p.lastVisitDate ?? undefined,
    totalSpent: Number(p.totalSpent ?? 0),
    balanceDue: Number(p.balanceDue ?? 0),
    dentalChart: mapChart(chart),
    notesHistory: (notes ?? []).map(mapNote),
    files
  };
}

/** Editable profile fields -> backend Patient JSON (only what was provided; the server ignores the rest). */
export function toApiPatientUpdate(u: Partial<Patient>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const copy = ['name', 'age', 'gender', 'phone', 'email', 'address', 'bloodGroup', 'medicalAlerts', 'chiefComplaint', 'previousDentalHistory', 'lastVisitDate'] as const;
  copy.forEach((k) => { if (u[k] !== undefined) out[k] = u[k]; });
  if (u.emergencyContact) {
    out.emergencyContactName = u.emergencyContact.name;
    out.emergencyContactPhone = u.emergencyContact.phone;
    out.emergencyContactRelation = u.emergencyContact.relation;
  }
  return out;
}

export function mapAppointment(a: Api): Appointment {
  return {
    id: a.id,
    appointmentNumber: a.appointmentNumber,
    patientId: a.patientId,
    patientName: a.patientName,
    patientPhone: a.patientPhone,
    date: a.date,
    time: a.time,
    durationMinutes: a.durationMinutes ?? 30,
    doctor: a.doctor,
    chair: a.chair,
    procedure: a.procedure,
    status: fromApiStatus(a.status),
    notes: a.notes ?? undefined,
    cancellationReason: a.cancellationReason ?? undefined
  };
}

export function mapInvoice(i: Api): Invoice {
  return {
    id: i.id,
    invoiceNumber: i.invoiceNumber,
    patientId: i.patientId,
    patientName: i.patientName,
    patientPhone: i.patientPhone,
    date: i.date,
    dueDate: i.dueDate,
    items: (i.items ?? []).map((it: Api) => ({
      id: it.id,
      description: it.description,
      code: it.code ?? undefined,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
      total: Number(it.total)
    })),
    subtotal: Number(i.subtotal),
    discount: Number(i.discount),
    tax: Number(i.tax),
    grandTotal: Number(i.grandTotal),
    amountPaid: Number(i.amountPaid),
    balanceDue: Number(i.balanceDue),
    status: lower(i.status) as PaymentStatus,
    paymentMethod: (i.paymentMethod ?? undefined) as PaymentMethod | undefined,
    paymentNotes: i.paymentNotes ?? undefined
  };
}

/** The server recalculates every total itself; we only send what the doctor typed. */
export function toApiInvoice(inv: Omit<Invoice, 'id' | 'invoiceNumber'>): Record<string, unknown> {
  return {
    patientId: inv.patientId,
    dueDate: inv.dueDate,
    discount: inv.discount,
    tax: inv.tax,
    amountPaid: inv.amountPaid,
    paymentMethod: inv.paymentMethod ?? null,
    paymentNotes: inv.paymentNotes ?? null,
    items: inv.items.map((it) => ({
      description: it.description,
      code: it.code ?? null,
      quantity: it.quantity,
      unitPrice: it.unitPrice
    }))
  };
}

export function mapPrescription(r: Api): Prescription {
  return {
    id: r.id,
    prescriptionNumber: r.prescriptionNumber,
    patientId: r.patientId,
    patientName: r.patientName,
    patientAge: Number(r.patientAge ?? 0),
    patientGender: r.patientGender ?? '',
    date: r.date,
    doctorName: r.doctorName,
    doctorDegree: r.doctorDegree,
    doctorRegNo: r.doctorRegNo,
    diagnosis: r.diagnosis ?? '',
    vitals: { bp: r.bp ?? undefined, pulse: r.pulse ?? undefined, sugar: r.sugar ?? undefined },
    medicines: (r.medicines ?? []).map((m: Api): PrescriptionMedicine => ({
      id: m.id,
      name: m.name,
      strength: m.strength ?? '',
      dosage: m.dosage ?? '',
      frequency: m.frequency ?? '',
      duration: m.duration ?? '',
      timing: (m.timing ?? 'After Food') as PrescriptionMedicine['timing'],
      instructions: m.instructions ?? undefined
    })),
    generalAdvice: r.generalAdvice ?? '',
    nextFollowUp: r.nextFollowUp ?? '',
    toothNumbers: r.toothNumbers ?? []
  };
}

export function toApiPrescription(rx: Omit<Prescription, 'id' | 'prescriptionNumber'>): Record<string, unknown> {
  return {
    patientId: rx.patientId,
    patientName: rx.patientName,
    patientAge: rx.patientAge,
    patientGender: rx.patientGender,
    date: rx.date,
    diagnosis: rx.diagnosis,
    bp: rx.vitals?.bp ?? null,
    pulse: rx.vitals?.pulse ?? null,
    sugar: rx.vitals?.sugar ?? null,
    generalAdvice: rx.generalAdvice,
    nextFollowUp: rx.nextFollowUp || null,
    toothNumbers: rx.toothNumbers ?? [],
    medicines: rx.medicines.map((m) => ({
      name: m.name,
      strength: m.strength,
      dosage: m.dosage,
      frequency: m.frequency,
      duration: m.duration,
      timing: m.timing,
      instructions: m.instructions ?? null
    }))
  };
}
