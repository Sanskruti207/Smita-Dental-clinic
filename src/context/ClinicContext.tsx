import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  User,
  UserRole,
  LoginResult,
  Patient,
  Appointment,
  Invoice,
  Prescription,
  ToothCondition,
  PaymentMethod,
  AppointmentStatus,
  ClinicalNote,
  PatientFile,
  DoctorTabId,
  PatientTabId,
  PatientRegistrationInput,
  SimulatedNotification,
  ToastMessage
} from '../types/clinic';
import { navigateTo, ROUTES } from '../utils/authRoute';
import { http, tokenStore, errorMessage, ApiError, UNAUTHORIZED_EVENT } from '../api/client';
import {
  mapUser,
  mapPatient,
  mapAppointment,
  mapInvoice,
  mapPrescription,
  mapNote,
  toApiStatus,
  toApiPatientUpdate,
  toApiInvoice,
  toApiPrescription
} from '../api/mappers';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ClinicContextType {
  // Auth & Session
  currentUser: User | null;
  currentRole: UserRole;
  /** true while a saved session is being restored / data is first loading */
  isLoading: boolean;
  login: (email: string, password: string, expectedRole?: UserRole) => Promise<LoginResult>;
  logout: () => void;

  // Patient Registration & Sign Up
  registerPatientWithAccount: (input: PatientRegistrationInput) => Promise<LoginResult>;

  // Active view tabs
  doctorTab: DoctorTabId;
  setDoctorTab: (tab: DoctorTabId) => void;
  patientTab: PatientTabId;
  setPatientTab: (tab: PatientTabId) => void;

  // Selected Patient (for Doctor view)
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient: Patient | undefined;

  // Master Data collections (loaded from the Spring Boot API)
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  prescriptions: Prescription[];
  notifications: SimulatedNotification[];
  visibleNotifications: SimulatedNotification[];

  // Modals & Printable Previews
  isNewAppointmentModalOpen: boolean;
  setIsNewAppointmentModalOpen: (open: boolean) => void;
  activePrintInvoice: Invoice | null;
  setActivePrintInvoice: (inv: Invoice | null) => void;
  activePrintPrescription: Prescription | null;
  setActivePrintPrescription: (rx: Prescription | null) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // CRUD - Patients (all calls go to the backend; null / void results mean the server said no and a toast was shown)
  addPatient: (data: Partial<Patient> & { name: string; phone: string; age: number; gender: 'Male' | 'Female' | 'Other' }) => Promise<Patient | null>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  updateToothCondition: (patientId: string, toothNumber: number, condition: ToothCondition) => Promise<void>;
  addClinicalNote: (patientId: string, note: Omit<ClinicalNote, 'id' | 'date'>) => Promise<void>;
  addPatientFile: (patientId: string, file: Omit<PatientFile, 'id'>) => void;
  deletePatientFile: (patientId: string, fileId: string) => void;

  // CRUD - Appointments
  addAppointment: (data: Omit<Appointment, 'id' | 'appointmentNumber'>, isFromPatient?: boolean) => Promise<Appointment | null>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, cancellationReason?: string) => Promise<void>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string, notes?: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;

  // CRUD - Prescriptions
  addPrescription: (data: Omit<Prescription, 'id' | 'prescriptionNumber'>) => Promise<Prescription | null>;
  deletePrescription: (id: string) => Promise<void>;

  // CRUD - Invoices & Payments
  addInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber'>) => Promise<Invoice | null>;
  deleteInvoice: (id: string) => Promise<void>;
  recordPayment: (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => Promise<void>;

  // Notifications & Toasts
  addNotification: (notif: Omit<SimulatedNotification, 'id' | 'timestamp' | 'status'>) => void;
  clearNotifications: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  /** Re-download everything from the server. */
  refreshData: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

/**
 * Only UI-side extras live in localStorage now:
 *  - the simulated SMS/e-mail notification feed
 *  - patient file attachments (the backend has no file-storage endpoint yet)
 * All clinical data (patients, appointments, invoices, prescriptions) comes from the backend.
 */
const STORAGE_KEYS = {
  NOTIFICATIONS: 'sdc_notifications_v6',
  PATIENT_FILES: 'sdc_patient_files_v1'
};

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full/unavailable */ }
};

const today = () => new Date().toISOString().split('T')[0];

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!tokenStore.get()); // restoring a saved session?

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [notifications, setNotifications] = useState<SimulatedNotification[]>(() =>
    readJson<SimulatedNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
  );
  const [patientFiles, setPatientFiles] = useState<Record<string, PatientFile[]>>(() =>
    readJson<Record<string, PatientFile[]>>(STORAGE_KEYS.PATIENT_FILES, {})
  );

  const [doctorTab, setDoctorTabState] = useState<DoctorTabId>('dr-schedule');
  const [patientTab, setPatientTabState] = useState<PatientTabId>('patient-dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);
  const [activePrintPrescription, setActivePrintPrescription] = useState<Prescription | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const filesRef = useRef(patientFiles);
  filesRef.current = patientFiles;

  useEffect(() => { writeJson(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { writeJson(STORAGE_KEYS.PATIENT_FILES, patientFiles); }, [patientFiles]);

  // Once signed in, leave the /patient/login or /doctor/login address - the portal itself lives at "/"
  useEffect(() => {
    if (currentUser && window.location.pathname !== ROUTES.home) {
      navigateTo(ROUTES.home, true);
    }
  }, [currentUser]);

  /* ---------- Toasts & notifications ---------- */

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  const addNotification = useCallback((notif: Omit<SimulatedNotification, 'id' | 'timestamp' | 'status'>) => {
    const newNotif: SimulatedNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const currentRole: UserRole = currentUser?.role || 'doctor';

  // STRICT NOTIFICATION ISOLATION: doctors only see doctor alerts, patients only see their own.
  const visibleNotifications = useMemo(() => {
    if (currentRole === 'doctor') {
      return notifications.filter((n) => n.targetRole === 'doctor' || n.targetRole === 'both');
    }
    const activePatId = currentUser?.patientId || selectedPatientId;
    return notifications.filter((n) => {
      if (n.targetRole === 'doctor') return false;
      return !!n.patientId && n.patientId === activePatId;
    });
  }, [notifications, currentRole, currentUser, selectedPatientId]);

  const clearNotifications = () => {
    const visibleIds = new Set(visibleNotifications.map((n) => n.id));
    setNotifications((prev) => prev.filter((n) => !visibleIds.has(n.id)));
  };

  /* ---------- Loading data from the backend ---------- */

  const loadPatientDetail = async (raw: any): Promise<Patient> => {
    const [chart, notes] = await Promise.all([
      http.get<any[]>(`/api/patients/${raw.id}/chart`),
      http.get<any[]>(`/api/prescriptions/notes/patient/${raw.id}`)
    ]);
    return mapPatient(raw, chart, notes, filesRef.current[raw.id] ?? []);
  };

  const loadAll = useCallback(async (user: User) => {
    if (user.role === 'doctor') {
      const [rawPatients, rawApts, rawInvoices, rawRx] = await Promise.all([
        http.get<any[]>('/api/patients'),
        http.get<any[]>('/api/appointments/all'),
        http.get<any[]>('/api/billing/invoices'),
        http.get<any[]>('/api/prescriptions')
      ]);
      const detailed = await Promise.all(rawPatients.map(loadPatientDetail));
      setPatients(detailed);
      setAppointments(rawApts.map(mapAppointment));
      setInvoices(rawInvoices.map(mapInvoice));
      setPrescriptions(rawRx.map(mapPrescription));
      setSelectedPatientId((prev) => (detailed.some((p) => p.id === prev) ? prev : detailed[0]?.id ?? ''));
    } else if (user.patientId) {
      const pid = user.patientId;
      const [rawPatient, rawApts, rawInvoices, rawRx] = await Promise.all([
        http.get<any>(`/api/patients/${pid}`),
        http.get<any[]>(`/api/appointments/patient/${pid}`),
        http.get<any[]>(`/api/billing/patient/${pid}`),
        http.get<any[]>(`/api/prescriptions/patient/${pid}`)
      ]);
      setPatients([await loadPatientDetail(rawPatient)]);
      setAppointments(rawApts.map(mapAppointment));
      setInvoices(rawInvoices.map(mapInvoice));
      setPrescriptions(rawRx.map(mapPrescription));
      setSelectedPatientId(pid);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setCurrentUser(null);
    setPatients([]);
    setAppointments([]);
    setInvoices([]);
    setPrescriptions([]);
    setSelectedPatientId('');
  }, []);

  // Restore a saved session on page load (token -> /api/auth/me -> data)
  useEffect(() => {
    if (!tokenStore.get()) return;
    let cancelled = false;
    (async () => {
      try {
        const user = mapUser(await http.get<any>('/api/auth/me'));
        await loadAll(user);
        if (!cancelled) setCurrentUser(user);
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadAll, clearSession]);

  // Token expired / rejected while using the app
  useEffect(() => {
    const onUnauthorized = () => {
      const wasDoctor = currentUser?.role === 'doctor';
      clearSession();
      addToast('Session expired', 'Please sign in again.', 'warning');
      navigateTo(wasDoctor ? ROUTES.doctorLogin : ROUTES.patientLogin, true);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [currentUser, clearSession, addToast]);

  const refreshData = async () => {
    if (!currentUser) return;
    try {
      await loadAll(currentUser);
      addToast('Data refreshed', 'Latest records loaded from the clinic server.', 'info');
    } catch (e) {
      addToast('Refresh failed', errorMessage(e), 'error');
    }
  };

  /** Re-read one patient from the server (balances change when invoices/payments change). */
  const refreshPatient = async (id: string) => {
    try {
      const fresh = await loadPatientDetail(await http.get<any>(`/api/patients/${id}`));
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...fresh, files: p.files } : p)));
    } catch { /* non-critical */ }
  };

  /* ---------- Auth ---------- */

  const finishSignIn = async (token: string, user: User) => {
    tokenStore.set(token);
    await loadAll(user);
    setCurrentUser(user);
    if (user.role === 'patient' && user.patientId) {
      setSelectedPatientId(user.patientId);
      setPatientTabState('patient-dashboard');
    } else {
      setDoctorTabState('dr-schedule');
    }
  };

  // expectedRole = which login page was used. Patients sign in on /patient/login, the doctor on /doctor/login.
  const login = async (email: string, password: string, expectedRole?: UserRole): Promise<LoginResult> => {
    const path = expectedRole ? `/api/auth/login/${expectedRole}` : '/api/auth/login';
    try {
      const res = await http.post<any>(path, { email: email.trim().toLowerCase(), password });
      const user = mapUser(res.user);
      await finishSignIn(res.token, user);
      if (user.role === 'patient') {
        addToast(`Welcome back, ${user.name}!`, 'Patient Portal loaded.', 'success');
      } else {
        addToast('Welcome Dr. Smita Bevle', 'Doctor Workstation loaded.', 'success');
      }
      return { success: true };
    } catch (e) {
      tokenStore.clear();
      const message = errorMessage(e);
      addToast('Sign in failed', message, 'error');
      return { success: false, message };
    }
  };

  const logout = () => {
    const loginPage = !currentUser
      ? ROUTES.home
      : currentUser.role === 'doctor'
        ? ROUTES.doctorLogin
        : ROUTES.patientLogin;
    clearSession();
    navigateTo(loginPage, true);
    addToast('Signed Out', 'You have been signed out.', 'info');
  };

  const registerPatientWithAccount = async (input: PatientRegistrationInput): Promise<LoginResult> => {
    try {
      const res = await http.post<any>('/api/auth/register', {
        name: input.name.trim(),
        age: Number(input.age),
        gender: input.gender,
        phone: input.phone.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        address: input.address.trim(),
        bloodGroup: input.bloodGroup,
        emergencyContactName: input.emergencyContactName.trim(),
        emergencyContactPhone: input.emergencyContactPhone.trim(),
        emergencyContactRelation: input.emergencyContactRelation.trim(),
        medicalAlerts: input.medicalAlerts || [],
        chiefComplaint: input.chiefComplaint.trim(),
        previousDentalHistory: input.previousDentalHistory?.trim() || 'No prior adverse dental history noted.'
      });
      const user = mapUser(res.user);
      await finishSignIn(res.token, user);
      addToast('Registration Complete!', `Account created for ${user.name}. Welcome to your private portal.`, 'success');
      return { success: true };
    } catch (e) {
      tokenStore.clear();
      const message = errorMessage(e);
      addToast('Registration failed', message, 'error');
      return { success: false, message };
    }
  };

  /* ---------- Patients ---------- */

  const addPatient: ClinicContextType['addPatient'] = async (data) => {
    try {
      const raw = await http.post<any>('/api/patients', {
        name: data.name,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        // the backend requires an e-mail address for every patient record
        email: data.email || `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@example.com`,
        address: data.address || '',
        bloodGroup: data.bloodGroup || '',
        emergencyContactName: data.emergencyContact?.name || '',
        emergencyContactPhone: data.emergencyContact?.phone || '',
        emergencyContactRelation: data.emergencyContact?.relation || '',
        medicalAlerts: data.medicalAlerts || [],
        chiefComplaint: data.chiefComplaint || 'Dental examination',
        previousDentalHistory: data.previousDentalHistory || ''
      });
      const patient = await loadPatientDetail(raw);
      setPatients((prev) => [patient, ...prev]);
      setSelectedPatientId(patient.id);
      addToast('Patient Registered', `${patient.name} (${patient.patientIdCode}) added to the database.`, 'success');
      return patient;
    } catch (e) {
      addToast('Could not add patient', errorMessage(e), 'error');
      return null;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const raw = await http.put<any>(`/api/patients/${id}`, toApiPatientUpdate(updates));
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...mapPatient(raw), dentalChart: p.dentalChart, notesHistory: p.notesHistory, files: p.files } : p)));
      addToast('Patient Updated', 'Patient record has been updated successfully.', 'success');
    } catch (e) {
      addToast('Could not update patient', errorMessage(e), 'error');
    }
  };

  const deletePatient = async (id: string) => {
    const patient = patients.find((p) => p.id === id);
    try {
      await http.del(`/api/patients/${id}`);
      const remaining = patients.filter((p) => p.id !== id);
      setPatients(remaining);
      setAppointments((prev) => prev.filter((a) => a.patientId !== id));
      setInvoices((prev) => prev.filter((i) => i.patientId !== id));
      setPrescriptions((prev) => prev.filter((r) => r.patientId !== id));
      if (selectedPatientId === id) setSelectedPatientId(remaining[0]?.id ?? '');
      addToast('Patient Deleted', `Patient ${patient?.name || id} and all linked records removed.`, 'warning');
    } catch (e) {
      addToast('Could not delete patient', errorMessage(e), 'error');
    }
  };

  const updateToothCondition = async (patientId: string, toothNumber: number, condition: ToothCondition) => {
    const previous = patients.find((p) => p.id === patientId)?.dentalChart[toothNumber];
    const apply = (c: ToothCondition) =>
      setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, dentalChart: { ...p.dentalChart, [toothNumber]: c } } : p)));
    apply(condition); // optimistic: the chart reacts instantly
    try {
      await http.put(`/api/patients/${patientId}/chart/tooth`, { toothNumber, condition: condition.toUpperCase() });
      addToast('Odontogram Updated', `Tooth #${toothNumber} condition marked as "${condition.toUpperCase()}".`, 'info');
    } catch (e) {
      if (previous) apply(previous); // roll back
      addToast('Could not save tooth condition', errorMessage(e), 'error');
    }
  };

  const addClinicalNote = async (patientId: string, note: Omit<ClinicalNote, 'id' | 'date'>) => {
    try {
      const saved = mapNote(await http.post<any>('/api/prescriptions/notes', { ...note, patientId }));
      setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, notesHistory: [saved, ...p.notesHistory] } : p)));
      addToast('Clinical Notes Saved', 'Diagnostic notes and treatment plan recorded by Dr. Smita Bevle.', 'success');
    } catch (e) {
      addToast('Could not save clinical notes', errorMessage(e), 'error');
    }
  };

  // File attachments: kept in the browser only (no backend storage endpoint yet)
  const addPatientFile = (patientId: string, file: Omit<PatientFile, 'id'>) => {
    const newFile: PatientFile = { ...file, id: 'file-' + Date.now() };
    setPatientFiles((prev) => ({ ...prev, [patientId]: [newFile, ...(prev[patientId] ?? [])] }));
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, files: [newFile, ...p.files] } : p)));
    addToast('File Uploaded', `${file.name} added to patient records (stored in this browser only).`, 'success');
  };

  const deletePatientFile = (patientId: string, fileId: string) => {
    setPatientFiles((prev) => ({ ...prev, [patientId]: (prev[patientId] ?? []).filter((f) => f.id !== fileId) }));
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, files: p.files.filter((f) => f.id !== fileId) } : p)));
    addToast('File Removed', 'Medical record file deleted.', 'info');
  };

  /* ---------- Appointments ---------- */

  const addAppointment: ClinicContextType['addAppointment'] = async (data, isFromPatient = false) => {
    try {
      const newApt = mapAppointment(
        await http.post<any>('/api/appointments/book', {
          patientId: data.patientId,
          date: data.date,
          time: data.time,
          chair: data.chair,
          procedure: data.procedure,
          durationMinutes: data.durationMinutes,
          notes: data.notes
        })
      );
      setAppointments((prev) => [newApt, ...prev]);

      addNotification({
        type: 'sms',
        recipientName: newApt.patientName,
        recipientContact: newApt.patientPhone,
        title: 'Appointment Confirmed - Dr. Smita Bevle',
        message: `Hello ${newApt.patientName}, your dental appointment with Dr. Smita Bevle is confirmed for ${newApt.date} at ${newApt.time} (Chair ${newApt.chair}) for ${newApt.procedure}. Please arrive 10 minutes prior.`,
        patientId: newApt.patientId,
        targetRole: 'patient'
      });
      addNotification({
        type: 'sms',
        recipientName: 'Dr. Smita Bevle',
        recipientContact: '+91 98200-SMITA',
        title: isFromPatient ? 'New Online Patient Booking' : 'Appointment Scheduled',
        message: `Visit confirmed for ${newApt.patientName} on ${newApt.date} at ${newApt.time} (Chair ${newApt.chair}) for ${newApt.procedure}.`,
        patientId: newApt.patientId,
        targetRole: 'doctor'
      });

      addToast(
        isFromPatient ? 'Appointment confirmed!' : 'Appointment Booked',
        `Scheduled for ${newApt.patientName} on ${newApt.date} at ${newApt.time}.`,
        'success'
      );
      return newApt;
    } catch (e) {
      // e.g. "Chair 1 is already occupied at 10:30 AM" (HTTP 409)
      addToast('Could not book appointment', errorMessage(e), 'error');
      return null;
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus, cancellationReason?: string) => {
    const existing = appointments.find((a) => a.id === id);
    if (!existing) return;
    try {
      let updated: Appointment;
      if (status === 'cancelled') {
        await http.post(`/api/appointments/${id}/cancel`, { reason: cancellationReason || 'Cancelled by user' });
        updated = { ...existing, status, cancellationReason: cancellationReason || existing.cancellationReason };
      } else {
        updated = mapAppointment(await http.patch<any>(`/api/appointments/${id}/status`, { status: toApiStatus(status) }));
      }
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));

      if (status === 'cancelled') {
        addNotification({
          type: 'sms',
          recipientName: updated.patientName,
          recipientContact: updated.patientPhone,
          title: 'Appointment Cancellation Notice',
          message: `Dear ${updated.patientName}, your appointment on ${updated.date} at ${updated.time} has been cancelled. Reason: ${cancellationReason || 'Schedule adjustment'}. Contact +91 98200-SMITA to re-book.`,
          patientId: updated.patientId,
          targetRole: 'patient'
        });
        addNotification({
          type: 'sms',
          recipientName: 'Dr. Smita Bevle',
          recipientContact: '+91 98200-SMITA',
          title: 'Schedule Alert: Appointment Cancelled',
          message: `Appointment for ${updated.patientName} on ${updated.date} at ${updated.time} was cancelled (${cancellationReason || 'Schedule adjustment'}).`,
          patientId: updated.patientId,
          targetRole: 'doctor'
        });
        addToast('Appointment Cancelled', `Notice sent to ${updated.patientName}.`, 'warning');
      } else {
        addToast('Status Updated', `Appointment status changed to "${status.toUpperCase()}".`, 'info');
      }
    } catch (e) {
      addToast('Could not update appointment', errorMessage(e), 'error');
    }
  };

  const rescheduleAppointment = async (id: string, newDate: string, newTime: string, notes?: string) => {
    try {
      const updated = mapAppointment(await http.patch<any>(`/api/appointments/${id}/reschedule`, { date: newDate, time: newTime, notes }));
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));

      addNotification({
        type: 'sms',
        recipientName: updated.patientName,
        recipientContact: updated.patientPhone,
        title: 'Appointment Rescheduled - Dr. Smita Bevle',
        message: `Dear ${updated.patientName}, your appointment with Dr. Smita Bevle has been rescheduled to ${newDate} at ${newTime}. We look forward to seeing you.`,
        patientId: updated.patientId,
        targetRole: 'patient'
      });
      addNotification({
        type: 'sms',
        recipientName: 'Dr. Smita Bevle',
        recipientContact: '+91 98200-SMITA',
        title: 'Schedule Alert: Appointment Rescheduled',
        message: `Patient ${updated.patientName} rescheduled to ${newDate} at ${newTime}.`,
        patientId: updated.patientId,
        targetRole: 'doctor'
      });
      addToast('Appointment Rescheduled', `Moved to ${newDate} at ${newTime}.`, 'success');
    } catch (e) {
      addToast('Could not reschedule', errorMessage(e), 'error');
    }
  };

  const deleteAppointment = async (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    try {
      await http.del(`/api/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      addToast('Appointment Removed', `Appointment #${apt?.appointmentNumber || id} removed from calendar.`, 'warning');
    } catch (e) {
      addToast('Could not remove appointment', errorMessage(e), 'error');
    }
  };

  /* ---------- Prescriptions ---------- */

  const addPrescription: ClinicContextType['addPrescription'] = async (data) => {
    try {
      const newRx = mapPrescription(await http.post<any>('/api/prescriptions', toApiPrescription(data)));
      setPrescriptions((prev) => [newRx, ...prev]);

      addNotification({
        type: 'email',
        recipientName: newRx.patientName,
        recipientContact: patients.find((p) => p.id === newRx.patientId)?.email ?? '',
        title: 'Digital Prescription Issued by Dr. Smita Bevle',
        message: `Dear ${newRx.patientName}, your official digital prescription (#${newRx.prescriptionNumber}) has been generated and is now viewable in your Patient Portal.`,
        patientId: newRx.patientId,
        targetRole: 'patient'
      });
      addNotification({
        type: 'email',
        recipientName: 'Dr. Smita Bevle',
        recipientContact: 'dr.smita@dentalclinic.com',
        title: 'EHR Log: Digital Prescription Issued',
        message: `Prescription #${newRx.prescriptionNumber} for ${newRx.patientName} (${newRx.diagnosis}) saved and synced to clinical charts.`,
        patientId: newRx.patientId,
        targetRole: 'doctor'
      });
      addToast('Prescription Issued', `Rx #${newRx.prescriptionNumber} synchronized to ${newRx.patientName}'s portal.`, 'success');
      return newRx;
    } catch (e) {
      addToast('Could not save prescription', errorMessage(e), 'error');
      return null;
    }
  };

  const deletePrescription = async (id: string) => {
    const rx = prescriptions.find((r) => r.id === id);
    try {
      await http.del(`/api/prescriptions/${id}`);
      setPrescriptions((prev) => prev.filter((r) => r.id !== id));
      addToast('Prescription Revoked', `Prescription #${rx?.prescriptionNumber || id} removed.`, 'warning');
    } catch (e) {
      addToast('Could not delete prescription', errorMessage(e), 'error');
    }
  };

  /* ---------- Invoices & payments ---------- */

  const addInvoice: ClinicContextType['addInvoice'] = async (data) => {
    try {
      const newInv = mapInvoice(await http.post<any>('/api/billing/invoices', toApiInvoice(data)));
      setInvoices((prev) => [newInv, ...prev]);
      await refreshPatient(newInv.patientId); // server updated the patient's balance
      addToast('Invoice Created', `Invoice #${newInv.invoiceNumber} ($${newInv.grandTotal}) created.`, 'success');
      return newInv;
    } catch (e) {
      addToast('Could not create invoice', errorMessage(e), 'error');
      return null;
    }
  };

  const deleteInvoice = async (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    try {
      await http.del(`/api/billing/invoices/${id}`);
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      if (inv) await refreshPatient(inv.patientId);
      addToast('Invoice Deleted', `Invoice #${inv?.invoiceNumber || id} removed.`, 'warning');
    } catch (e) {
      addToast('Could not delete invoice', errorMessage(e), 'error');
    }
  };

  const recordPayment = async (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => {
    try {
      const updated = mapInvoice(
        await http.post<any>(`/api/billing/invoices/${invoiceId}/pay`, { amount, paymentMethod: method, paymentNotes: notes })
      );
      setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? updated : inv)));
      await refreshPatient(updated.patientId);

      addNotification({
        type: 'sms',
        recipientName: updated.patientName,
        recipientContact: updated.patientPhone,
        title: 'Payment Receipt - Smita Dental Clinic',
        message: `Thank you ${updated.patientName}! Payment of $${amount.toFixed(2)} received via ${method.toUpperCase()} for Invoice #${updated.invoiceNumber}. Remaining balance: $${updated.balanceDue.toFixed(2)}.`,
        patientId: updated.patientId,
        targetRole: 'patient'
      });
      addNotification({
        type: 'sms',
        recipientName: 'Dr. Smita Bevle',
        recipientContact: '+91 98200-SMITA',
        title: 'Payment Received into Clinic Account',
        message: `Collected $${amount.toFixed(2)} via ${method.toUpperCase()} from ${updated.patientName} for Invoice #${updated.invoiceNumber}.`,
        patientId: updated.patientId,
        targetRole: 'doctor'
      });
      addToast('Payment Recorded', `Received $${amount.toFixed(2)} via ${method.toUpperCase()} for ${updated.patientName}.`, 'success');
    } catch (e) {
      addToast('Could not record payment', errorMessage(e), 'error');
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  return (
    <ClinicContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoading,
        login,
        logout,
        registerPatientWithAccount,
        doctorTab,
        setDoctorTab: setDoctorTabState,
        patientTab,
        setPatientTab: setPatientTabState,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        patients,
        appointments,
        invoices,
        prescriptions,
        notifications,
        visibleNotifications,
        isNewAppointmentModalOpen,
        setIsNewAppointmentModalOpen,
        activePrintInvoice,
        setActivePrintInvoice,
        activePrintPrescription,
        setActivePrintPrescription,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        addPatient,
        updatePatient,
        deletePatient,
        updateToothCondition,
        addClinicalNote,
        addPatientFile,
        deletePatientFile,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        deleteAppointment,
        addPrescription,
        deletePrescription,
        addInvoice,
        deleteInvoice,
        recordPayment,
        addNotification,
        clearNotifications,
        toasts,
        addToast,
        removeToast,
        refreshData
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

// re-exported so components can tell API failures apart if they ever need to
export { ApiError };
