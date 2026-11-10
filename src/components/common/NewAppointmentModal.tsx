import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { X, Calendar, Clock, User, Stethoscope, Sparkles } from 'lucide-react';
import { DENTAL_TARIFF_ITEMS } from '../../data/mockData';

export const NewAppointmentModal: React.FC = () => {
  const {
    isNewAppointmentModalOpen,
    setIsNewAppointmentModalOpen,
    patients,
    addAppointment,
    selectedPatientId
  } = useClinic();

  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [chair, setChair] = useState<1 | 2 | 3>(1);
  const [procedure, setProcedure] = useState(DENTAL_TARIFF_ITEMS[0].description);
  const [notes, setNotes] = useState('');

  if (!isNewAppointmentModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) {
      alert('Please select a valid patient.');
      return;
    }

    const booked = await addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date,
      time,
      durationMinutes,
      doctor: 'Dr. Smita Bevle',
      chair,
      procedure,
      status: 'scheduled',
      notes
    });

    if (booked) {
      setIsNewAppointmentModalOpen(false);
    }
  };

  const times = [
    '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base">Schedule Clinical Appointment</h3>
              <p className="text-[11px] text-white/80">Dr. Smita Bevle • Operatory Chairs 1-3</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewAppointmentModalOpen(false)}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none font-medium text-slate-900 cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientIdCode} • {p.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Appointment Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none font-mono font-medium text-slate-900 cursor-pointer"
              >
                {times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Operatory Chair</label>
              <select
                value={chair}
                onChange={(e) => setChair(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none font-medium text-slate-900 cursor-pointer"
              >
                <option value={1}>Operatory Chair 1 (Surgery/Prostho)</option>
                <option value={2}>Operatory Chair 2 (Hygiene/Perio)</option>
                <option value={3}>Operatory Chair 3 (Consultation/Laser)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none font-medium text-slate-900 cursor-pointer"
              >
                <option value={20}>20 Minutes (Brief Check)</option>
                <option value={30}>30 Minutes (Standard)</option>
                <option value={45}>45 Minutes (Restorative)</option>
                <option value={60}>60 Minutes (Crown / Surgery)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Planned Dental Procedure</label>
            <select
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none font-medium text-slate-900 cursor-pointer"
            >
              {DENTAL_TARIFF_ITEMS.map((item) => (
                <option key={item.code} value={item.description}>
                  {item.description} (${item.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Clinical Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Patient sensitivity reported, crown impression preparation..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewAppointmentModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/25"
            >
              <span>Confirm & Lock Operatory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
