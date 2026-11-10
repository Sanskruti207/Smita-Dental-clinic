import React, { useEffect, useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { DENTAL_TARIFF_ITEMS } from '../../data/mockData';
import { http } from '../../api/client';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';

interface DoctorLiveSchedulePickerProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const DoctorLiveSchedulePicker: React.FC<DoctorLiveSchedulePickerProps> = ({
  onSuccess,
  compact = false
}) => {
  const { selectedPatient, appointments, addAppointment } = useClinic();

  // Live slot grid for the chosen date, straight from the server (all 3 chairs, all patients).
  // Patients can only download their own appointments, so occupancy must come from this endpoint.
  const [slots, setSlots] = useState<{ timeSlot: string; chair: number; occupied: boolean }[]>([]);
  const [slotsError, setSlotsError] = useState('');

  // Default to tomorrow or today
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [procedure, setProcedure] = useState(DENTAL_TARIFF_ITEMS[0].description);
  const [patientNote, setPatientNote] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedSlotInfo, setBookedSlotInfo] = useState<{ date: string; time: string } | null>(null);

  // Quick date generator for the next 5 days
  const quickDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayLabel, formatted };
  });

  useEffect(() => {
    let cancelled = false;
    setSlotsError('');
    http
      .get<{ timeSlot: string; chair: number; occupied: boolean }[]>(`/api/appointments/slots?date=${selectedDate}`)
      .then((data) => { if (!cancelled) setSlots(data); })
      .catch((e) => {
        if (!cancelled) {
          setSlots([]);
          setSlotsError(e instanceof Error ? e.message : 'Could not load the schedule.');
        }
      });
    return () => { cancelled = true; };
    // re-load after every booking / cancellation (appointments changes)
  }, [selectedDate, appointments]);

  const TIME_SLOTS = Array.from(new Set(slots.map((sl) => sl.timeSlot)));
  const freeChairsAt = (time: string) =>
    slots.filter((sl) => sl.timeSlot === time && !sl.occupied).map((sl) => sl.chair).sort();

  const handleSlotClick = (slot: string, isOccupied: boolean, isMine: boolean) => {
    if (isOccupied || isMine) return;
    setSelectedTime(slot);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !selectedTime) return;

    const freeChair = freeChairsAt(selectedTime)[0];
    if (!freeChair) return;

    const booked = await addAppointment(
      {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientPhone: selectedPatient.phone,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: 30,
        doctor: 'Dr. Smita Bevle', // Strictly Dr. Smita Bevle
        chair: freeChair as 1 | 2 | 3,
        procedure,
        status: 'scheduled',
        notes: patientNote ? `Patient note: ${patientNote}` : 'Booked via Live Schedule visualizer'
      },
      true // isFromPatient = true
    );

    if (!booked) return; // e.g. someone else just took the slot: the error toast explains, the grid refreshes

    setBookedSlotInfo({ date: selectedDate, time: selectedTime });
    setBookingSuccess(true);
    setSelectedTime(null);
    setPatientNote('');

    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-5 sm:p-8 shadow-xs space-y-6">
      {/* Header & Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-100 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>REAL-TIME DOCTOR AVAILABILITY</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dr. Smita Bevle's Live Schedule
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Already occupied slots are locked. Pick any unoccupied slot to reserve your upcoming visit.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span className="font-semibold text-slate-500">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="font-semibold text-purple-700">Your Booking</span>
          </div>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Select Date</span>
          <span className="text-[11px] text-indigo-600 font-semibold">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {quickDays.map((q) => {
            const isSelected = selectedDate === q.dateStr;
            return (
              <button
                key={q.dateStr}
                type="button"
                onClick={() => {
                  setSelectedDate(q.dateStr);
                  setSelectedTime(null);
                  setBookingSuccess(false);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/25 scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span>{q.dayLabel}</span>
                <span className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {q.formatted}
                </span>
              </button>
            );
          })}

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Other Date:</span>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  setSelectedTime(null);
                  setBookingSuccess(false);
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {bookingSuccess && bookedSlotInfo && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs">Appointment Confirmed!</div>
              <div className="text-[11px] text-emerald-800">
                Booked for <strong>{bookedSlotInfo.date} at {bookedSlotInfo.time}</strong> with Dr. Smita Bevle. A confirmation SMS has been dispatched.
              </div>
            </div>
          </div>
          <button
            onClick={() => setBookingSuccess(false)}
            className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Time Slots Visualizer Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Available & Occupied Time Slots
          </span>
          <span className="text-[11px] text-slate-400">
            Dr. Smita Bevle (Sole Surgeon)
          </span>
        </div>

        {slotsError && (
          <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
            {slotsError}
          </div>
        )}
        {!slotsError && TIME_SLOTS.length === 0 && (
          <div className="text-xs text-slate-500">Loading live schedule...</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
          {TIME_SLOTS.map((slot) => {
            const freeChairs = freeChairsAt(slot);
            const matchingApt = appointments.find(
              (a) => a.date === selectedDate && a.time === slot && a.status !== 'cancelled' && a.patientId === selectedPatient?.id
            );
            const isMine = !!matchingApt;
            const isOccupied = freeChairs.length === 0;
            const isSelected = selectedTime === slot;

            if (isMine) {
              return (
                <div
                  key={slot}
                  className="p-3 rounded-2xl border border-purple-300 bg-purple-50/90 text-purple-950 shadow-2xs space-y-1 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold">{slot}</span>
                    <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded-full">
                      Yours
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold truncate text-purple-900">
                    {matchingApt?.procedure}
                  </div>
                  <div className="text-[10px] text-purple-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </div>
                </div>
              );
            }

            if (isOccupied) {
              return (
                <div
                  key={slot}
                  className="p-3 rounded-2xl border border-slate-200/90 bg-slate-100/70 text-slate-400 cursor-not-allowed select-none space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 line-through opacity-70">
                      {slot}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Booked
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Dr. Smita in session
                  </div>
                  <div className="text-[10px] text-slate-400">
                    All chairs occupied
                  </div>
                </div>
              );
            }

            // Available slot
            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSlotClick(slot, isOccupied, isMine)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/30 shadow-sm scale-[1.02]'
                    : 'border-slate-200/80 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-indigo-950 font-black' : 'text-slate-800'}`}>
                    {slot}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isSelected ? 'Selected' : 'Open'}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700">
                  Operatory Chair {freeChairs[0]}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Click to reserve
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Form (Appears smoothly when a slot is chosen) */}
      {selectedTime && (
        <form
          onSubmit={handleConfirmBooking}
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-200/80 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">
                  Confirm Booking with Dr. Smita Bevle
                </h4>
                <p className="text-[11px] text-indigo-900">
                  Reserved Slot: <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTime(null)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Dental Procedure
              </label>
              <select
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
              >
                {DENTAL_TARIFF_ITEMS.map((item) => (
                  <option key={item.code} value={item.description}>
                    {item.description} (${item.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Visit / Symptoms (Optional)
              </label>
              <input
                type="text"
                value={patientNote}
                onChange={(e) => setPatientNote(e.target.value)}
                placeholder="e.g. Mild pain in upper right tooth, sensitivity to cold..."
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant sync with Dr. Smita's Calendar + SMS confirmation</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Confirm Appointment ({selectedTime})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
