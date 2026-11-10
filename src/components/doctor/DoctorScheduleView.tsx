import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, AppointmentStatus } from '../../types/clinic';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Phone,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

const statusBadges: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  scheduled: { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', text: 'text-indigo-700', label: 'Scheduled' },
  'checked-in': { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'text-amber-700', label: 'Checked In' },
  'in-chair': { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'text-emerald-700', label: 'In Operatory Chair' },
  completed: { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-600', label: 'Completed' },
  rescheduled: { bg: 'bg-purple-50 text-purple-800 border-purple-200', text: 'text-purple-700', label: 'Rescheduled' },
  cancelled: { bg: 'bg-rose-50 text-rose-800 border-rose-200', text: 'text-rose-700', label: 'Cancelled' }
};

export const DoctorScheduleView: React.FC = () => {
  const {
    appointments,
    setIsNewAppointmentModalOpen,
    updateAppointmentStatus,
    rescheduleAppointment,
    deleteAppointment,
    setSelectedPatientId,
    setDoctorTab
  } = useClinic();

  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeChairFilter, setActiveChairFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newReschedDate, setNewReschedDate] = useState('');
  const [newReschedTime, setNewReschedTime] = useState('11:00 AM');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = apt.date === filterDate;
    const matchesChair = activeChairFilter === 'all' || apt.chair === activeChairFilter;
    return matchesDate && matchesChair;
  });

  const handlePrevDay = () => {
    const d = new Date(filterDate);
    d.setDate(d.getDate() - 1);
    setFilterDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(filterDate);
    d.setDate(d.getDate() + 1);
    setFilterDate(d.toISOString().split('T')[0]);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt || !newReschedDate) return;
    rescheduleAppointment(reschedulingApt.id, newReschedDate, newReschedTime);
    setReschedulingApt(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>OPERATORY WORKFLOW & DIARY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Master Clinic Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Real-time appointment statuses, synchronized patient bookings, and operatory chair allocations for Dr. Smita Bevle.
          </p>
        </div>

        <button
          onClick={() => setIsNewAppointmentModalOpen(true)}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment (CRUD)</span>
        </button>
      </div>

      {/* Date Navigation & Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-600"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-full">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-600"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Chair Filter Tabs (Pill style matching image.png) */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 text-xs font-bold">
          <button
            onClick={() => setActiveChairFilter('all')}
            className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
              activeChairFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Operatories
          </button>
          <button
            onClick={() => setActiveChairFilter(1)}
            className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
              activeChairFilter === 1 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chair 1 (Prostho)
          </button>
          <button
            onClick={() => setActiveChairFilter(2)}
            className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
              activeChairFilter === 2 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chair 2 (Hygiene)
          </button>
          <button
            onClick={() => setActiveChairFilter(3)}
            className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
              activeChairFilter === 3 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chair 3 (Laser)
          </button>
        </div>
      </div>

      {/* Appointments List / Grid */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-3">
            <CalendarIcon className="w-12 h-12 mx-auto text-indigo-200" />
            <h4 className="font-bold text-sm text-slate-700">No Appointments Scheduled for this Date</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Operatory chairs are open. Patients can self-book via their portal, or staff can book slots.
            </p>
            <button
              onClick={() => setIsNewAppointmentModalOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Slot</span>
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const badge = statusBadges[apt.status];
            return (
              <div
                key={apt.id}
                className="bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-indigo-150">
                      CH-{apt.chair}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPatientId(apt.patientId);
                            setDoctorTab('dr-patients');
                          }}
                          className="font-black text-slate-900 hover:text-indigo-600 hover:underline cursor-pointer text-base text-left"
                        >
                          {apt.patientName}
                        </button>
                        <span className="text-xs text-slate-400 font-mono">({apt.appointmentNumber})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <strong className="text-slate-800 font-mono">{apt.time}</strong> ({apt.durationMinutes} mins)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">{apt.patientPhone}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Procedure Planned
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{apt.procedure}</p>
                    {apt.notes && <p className="text-slate-500 text-[11px] mt-0.5">{apt.notes}</p>}
                    <p className="text-[10px] text-indigo-700 font-medium mt-1">
                      Attending Surgeon: <strong>Dr. Smita Bevle</strong>
                    </p>
                  </div>

                  {/* Status & CRUD Action Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                    {/* Status change actions */}
                    {apt.status === 'scheduled' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'checked-in')}
                        className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold transition cursor-pointer"
                      >
                        Check In
                      </button>
                    )}
                    {(apt.status === 'scheduled' || apt.status === 'checked-in') && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'in-chair')}
                        className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold transition cursor-pointer"
                      >
                        Seat in Chair
                      </button>
                    )}
                    {apt.status === 'in-chair' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                        className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold transition cursor-pointer"
                      >
                        Complete Visit
                      </button>
                    )}

                    {/* Reschedule button */}
                    <button
                      onClick={() => {
                        setReschedulingApt(apt);
                        setNewReschedDate(apt.date);
                        setNewReschedTime(apt.time);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-bold transition cursor-pointer flex items-center gap-1"
                      title="Reschedule Appointment"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Reschedule</span>
                    </button>

                    {/* Cancel appointment */}
                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for cancellation (will be SMS notified to patient):', 'Doctor surgery emergency');
                          if (reason !== null) {
                            updateAppointmentStatus(apt.id, 'cancelled', reason);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Delete appointment (CRUD: Delete) */}
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete appointment #${apt.appointmentNumber}?`)) {
                          deleteAppointment(apt.id);
                        }
                      }}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition cursor-pointer"
                      title="Permanently Delete Appointment (CRUD)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs border border-slate-100">
            <h3 className="font-black text-base text-slate-900">Reschedule Appointment</h3>
            <p className="text-slate-500 text-xs">
              Moving {reschedulingApt.patientName}'s appointment. An automated SMS update will be dispatched.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newReschedDate}
                  onChange={(e) => setNewReschedDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Time</label>
                <select
                  value={newReschedTime}
                  onChange={(e) => setNewReschedTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-2xl font-mono focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  {['09:30 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-600 hover:to-purple-700 transition shadow-sm shadow-indigo-500/25 cursor-pointer"
                >
                  Save & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
