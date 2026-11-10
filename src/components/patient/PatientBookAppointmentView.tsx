import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { DoctorLiveSchedulePicker } from './DoctorLiveSchedulePicker';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Info,
  ArrowLeft
} from 'lucide-react';

export const PatientBookAppointmentView: React.FC = () => {
  const { selectedPatient, setPatientTab } = useClinic();

  if (!selectedPatient) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>DIRECT DOCTOR RESERVATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Schedule with Dr. Smita Bevle
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            View currently occupied chair slots in real time and reserve an open appointment for your dental consultation, whitening, ceramic crown, or root canal therapy.
          </p>
        </div>

        <button
          onClick={() => setPatientTab('patient-dashboard')}
          className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Embedded Live Occupied Schedule Visualizer & Real-Time Booking */}
      <DoctorLiveSchedulePicker onSuccess={() => {}} />

      {/* Safety & Protocol Banner */}
      <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            <strong>Zero Collision Guarantee:</strong> Once booked, your selected slot is immediately locked across Dr. Smita Bevle's workstation.
          </span>
        </div>
        <div className="text-[11px] text-indigo-700">
          Operatory 1 & 2 • Hospital-Grade Autoclave Sterilized
        </div>
      </div>
    </div>
  );
};
