import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Odontogram } from '../common/Odontogram';
import {
  FileText,
  Printer,
  Calendar,
  Upload,
  Clock,
  Sparkles,
  Stethoscope,
  Trash2,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Pill,
  Activity
} from 'lucide-react';

export const PatientRecordsView: React.FC = () => {
  const {
    selectedPatient,
    prescriptions,
    setActivePrintPrescription,
    addPatientFile,
    deletePatientFile
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'prescriptions' | 'odontogram' | 'notes' | 'files'>('prescriptions');

  // File upload state
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<'X-Ray IOPA' | 'X-Ray OPG' | 'CBCT 3D' | 'Lab Report'>('X-Ray IOPA');

  if (!selectedPatient) return null;

  // Filter strictly for this patient
  const myPrescriptions = prescriptions.filter((r) => r.patientId === selectedPatient.id);
  const myNotes = selectedPatient.notesHistory || [];
  const myFiles = selectedPatient.files || [];

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    addPatientFile(selectedPatient.id, {
      patientId: selectedPatient.id,
      name: fileName,
      category: fileCategory,
      date: new Date().toISOString().split('T')[0],
      size: '2.4 MB',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      notes: 'Uploaded by patient via portal.'
    });

    setFileName('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Banner (Clean, modern rounded header matching image.png aesthetic) */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>ELECTRONIC HEALTH RECORD (EHR)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Health Records & Digital Prescriptions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            View your clinical history, 32-tooth dental condition chart, treatment notes by Dr. Smita Bevle, and downloadable Rx prescriptions.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'prescriptions'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-indigo-600" />
            <span>Prescriptions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-mono">
              {myPrescriptions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('odontogram')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'odontogram'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>Odontogram</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Doctor's Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>X-Rays & Files</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
              {myFiles.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: Digital Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-5">
          {myPrescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-indigo-200" />
              <h4 className="font-bold text-sm text-slate-700">No Prescriptions Issued Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Any official digital prescriptions authored and signed by Dr. Smita Bevle will appear here with instant PDF download and printing.
              </p>
            </div>
          ) : (
            myPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                        #{rx.prescriptionNumber}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Signed by Surgeon
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-2">{rx.diagnosis}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Issued on <strong>{rx.date}</strong></span>
                      <span>•</span>
                      <span>Attending: <strong>{rx.doctorName}</strong> ({rx.doctorRegNo})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePrintPrescription(rx)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shadow-sm shadow-indigo-500/25"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Download PDF</span>
                  </button>
                </div>

                {/* Medication Table */}
                <div className="text-xs space-y-2">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                    Prescribed Medication Regimen
                  </span>
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/30">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-xs">
                        <tr>
                          <th className="py-2.5 px-4">Medication</th>
                          <th className="py-2.5 px-4">Dosage</th>
                          <th className="py-2.5 px-4">Duration</th>
                          <th className="py-2.5 px-4">Timing</th>
                          <th className="py-2.5 px-4">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {rx.medicines.map((m) => (
                          <tr key={m.id}>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {m.name} <span className="text-indigo-600 font-mono text-[11px]">({m.strength})</span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800">{m.dosage}</td>
                            <td className="py-3 px-4 text-slate-600">{m.duration}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                                {m.timing}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px]">{m.instructions || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Advice & Next Visit Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Doctor's Advice & Home Care
                    </span>
                    <p className="text-slate-700 leading-relaxed">{rx.generalAdvice}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-150">
                    <span className="text-[10px] uppercase font-bold text-indigo-800 block mb-1">
                      Recommended Follow-Up Visit
                    </span>
                    <p className="text-indigo-950 font-bold">{rx.nextFollowUp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Odontogram */}
      {activeTab === 'odontogram' && (
        <div className="space-y-4">
          <Odontogram dentalChart={selectedPatient.dentalChart} interactive={false} />
          <div className="p-4 bg-white rounded-3xl border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              This 32-tooth anatomical odontogram is synced in real time with Dr. Smita Bevle's surgical workstation.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: Doctor's Clinical Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {myNotes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-500">No clinical examination notes recorded yet.</p>
            </div>
          ) : (
            myNotes.map((note) => (
              <div key={note.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                    <span className="font-black text-slate-900 text-sm">{note.attendingDoctor}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-xs font-bold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                    {note.date}
                  </span>
                </div>
                <div className="space-y-2 pt-1 text-slate-700 leading-relaxed">
                  <div>
                    <strong className="text-slate-900 font-bold">Chief Complaint:</strong> {note.chiefComplaint}
                  </div>
                  <div>
                    <strong className="text-slate-900 font-bold">Clinical Examination:</strong> {note.clinicalExamination}
                  </div>
                  {note.radiographicFindings && (
                    <div>
                      <strong className="text-slate-900 font-bold">Radiographic Findings:</strong> {note.radiographicFindings}
                    </div>
                  )}
                  <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-150">
                    <strong className="text-indigo-900 font-bold">Proposed Treatment Plan:</strong>{' '}
                    <span className="text-indigo-950 font-semibold">{note.proposedTreatment}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Files & X-Rays */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          {/* Upload Form Box */}
          <form onSubmit={handleUploadFile} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
            <div>
              <h4 className="font-black text-base text-slate-900">Upload Digital Dental Document / X-Ray</h4>
              <p className="text-xs text-slate-500 mt-0.5">Attach prior dental records, IOPA x-rays, or CBCT scans for Dr. Smita's review.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Document / X-Ray Name (e.g. Upper Left Premolar X-Ray.pdf)"
                className="p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
              />
              <select
                value={fileCategory}
                onChange={(e) => setFileCategory(e.target.value as any)}
                className="p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="X-Ray IOPA">X-Ray IOPA (Intraoral Periapical)</option>
                <option value="X-Ray OPG">X-Ray OPG (Orthopantomogram)</option>
                <option value="CBCT 3D">CBCT 3D Computed Tomography</option>
                <option value="Lab Report">Dental Lab Prosthetic Report</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/20"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Secure Records</span>
              </button>
            </div>
          </form>

          {/* Files List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myFiles.map((file) => (
              <div key={file.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate max-w-[200px]">{file.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{file.category} • {file.date}</div>
                  </div>
                </div>
                <button
                  onClick={() => deletePatientFile(selectedPatient.id, file.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
