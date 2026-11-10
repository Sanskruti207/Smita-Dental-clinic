import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Printer, X, Stethoscope, HeartPulse } from 'lucide-react';

export const PrintPrescriptionModal: React.FC = () => {
  const { activePrintPrescription, setActivePrintPrescription } = useClinic();

  if (!activePrintPrescription) return null;

  const rx = activePrintPrescription;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Top Action Bar (hidden on print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              Official Digital Prescription Letterhead
            </span>
            <span className="text-xs text-white/80 font-mono">#{rx.prescriptionNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-white text-indigo-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setActivePrintPrescription(null)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prescription Document */}
        <div className="p-8 space-y-6 text-slate-900 print:p-0">
          {/* Clinic & Doctor Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-indigo-700 pb-5">
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tight">SMITA DENTAL CLINIC</h1>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                Dr. Smita Bevle (BDS, MDS)
              </p>
              <p className="text-xs text-indigo-700 font-medium">
                Prosthodontist, Implantologist & Laser Dental Surgeon
              </p>
              <p className="text-xs text-slate-500">
                Maharashtra Dental Council Reg: <strong>D-48921-MMC</strong>
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <span className="inline-block px-3 py-1 bg-slate-100 rounded-full font-mono font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Rx #{rx.prescriptionNumber}
              </span>
              <p className="mt-2 font-medium">Date: <strong className="text-slate-800">{rx.date}</strong></p>
              <p className="text-[11px]">Bandra West, Mumbai - 400050</p>
            </div>
          </div>

          {/* Patient Details & Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{rx.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Age / Gender</span>
              <span className="font-medium text-slate-800">{rx.patientAge} Yrs / {rx.patientGender}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">BP Vitals</span>
              <span className="font-mono font-medium text-slate-800">{rx.vitals?.bp || '120/80 mmHg'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Pulse</span>
              <span className="font-mono font-medium text-slate-800">{rx.vitals?.pulse || '74 bpm'}</span>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Provisional Clinical Diagnosis:
            </span>
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-150 font-bold text-indigo-950">
              {rx.diagnosis}
            </div>
          </div>

          {/* Medications (Rx Symbol) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-black text-indigo-800 italic">℞</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Prescribed Medications
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Medicine & Strength</th>
                    <th className="py-2.5 px-4">Dosage / Frequency</th>
                    <th className="py-2.5 px-4">Duration</th>
                    <th className="py-2.5 px-4">Special Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rx.medicines.map((m, idx) => (
                    <tr key={m.id}>
                      <td className="py-2.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {m.name} <span className="font-mono text-indigo-700 text-[11px]">({m.strength})</span>
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">{m.dosage}</td>
                      <td className="py-2.5 px-4 text-slate-600">{m.duration}</td>
                      <td className="py-2.5 px-4 text-slate-600">
                        <span className="font-semibold text-slate-900">{m.timing}</span>
                        {m.instructions && <span> • {m.instructions}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice & Next Visit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Surgeon's Advice / Diet
              </span>
              <p className="text-slate-700 leading-relaxed">{rx.generalAdvice}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Next Follow-Up Visit
              </span>
              <p className="text-indigo-900 font-bold">{rx.nextFollowUp}</p>
            </div>
          </div>

          {/* Signature & Stamp */}
          <div className="border-t border-slate-200 pt-8 flex justify-between items-end text-xs">
            <p className="text-[10px] text-slate-400 max-w-xs">
              Valid only if signed by Dr. Smita Bevle. Not valid for medico-legal purposes. Store medicines out of reach of children.
            </p>
            <div className="text-center">
              <div className="w-36 border-b border-slate-400 pb-8 mb-1 text-center font-serif italic text-slate-500 text-sm">
                Dr. Smita Bevle
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Dr. Smita Bevle (MDS)
              </span>
              <span className="text-[9px] text-slate-400">Sole Attending Dental Surgeon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
