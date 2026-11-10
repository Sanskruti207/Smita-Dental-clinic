import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Odontogram } from '../common/Odontogram';
import { STANDARD_DENTAL_DRUGS } from '../../data/mockData';
import {
  Patient,
  ToothCondition,
  PrescriptionMedicine,
  ClinicalNote
} from '../../types/clinic';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Printer,
  Stethoscope,
  HeartPulse,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Save,
  Clock,
  Sparkles,
  ShieldCheck,
  Activity,
  Layers,
  FileCheck
} from 'lucide-react';

export const DoctorPatientDatabaseView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    addPatient,
    updatePatient,
    deletePatient,
    updateToothCondition,
    addClinicalNote,
    addPrescription,
    setActivePrintPrescription,
    prescriptions
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'chart' | 'notes' | 'rx' | 'edit'>('chart');

  // Edit Patient Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: 30,
    address: '',
    bloodGroup: 'B+',
    chiefComplaint: ''
  });

  // Clinical Note Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalExam, setClinicalExam] = useState('');
  const [radiographicFindings, setRadiographicFindings] = useState('');
  const [proposedTreatment, setProposedTreatment] = useState('');
  const [chairNumber, setChairNumber] = useState<number>(1);

  // Prescription Generator State
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState<PrescriptionMedicine[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState('Maintain oral hygiene, avoid chewing hard foods on affected side.');
  const [nextFollowUp, setNextFollowUp] = useState('In 5 days for follow-up evaluation.');
  const [bp, setBp] = useState('120/80 mmHg');
  const [pulse, setPulse] = useState('74 bpm');

  // New Quick Patient Modal
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientAge, setNewPatientAge] = useState(30);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.patientIdCode.toLowerCase().includes(q)
    );
  });

  const patient = selectedPatient || patients[0];

  const handleStartEdit = () => {
    if (!patient) return;
    setEditFormData({
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      age: patient.age,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      chiefComplaint: patient.chiefComplaint
    });
    setIsEditing(true);
    setActiveSubTab('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    updatePatient(patient.id, editFormData);
    setIsEditing(false);
    setActiveSubTab('chart');
  };

  const handleAddQuickDrug = (drug: typeof STANDARD_DENTAL_DRUGS[0]) => {
    const newMed: PrescriptionMedicine = {
      id: 'med-' + Date.now() + Math.random().toString(36).substring(2, 4),
      name: drug.name,
      strength: drug.strength,
      dosage: drug.defaultDosage,
      frequency: 'Standard',
      duration: drug.defaultDuration,
      timing: drug.timing,
      instructions: drug.note
    };
    setSelectedMedicines((prev) => [...prev, newMed]);
  };

  const handleRemoveMed = (id: string) => {
    setSelectedMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    if (selectedMedicines.length === 0) {
      alert('Please add at least one medication to the prescription.');
      return;
    }

    const newRx = await addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      date: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Smita Bevle',
      doctorDegree: 'BDS, MDS (Prosthodontics & Oral Implantology)',
      doctorRegNo: 'D-48921-MMC',
      diagnosis: diagnosis || patient.chiefComplaint || 'Dental examination and treatment',
      vitals: { bp, pulse },
      medicines: selectedMedicines,
      generalAdvice,
      nextFollowUp
    });

    if (!newRx) return; // server refused: an error toast was already shown, keep the form as it is

    // Reset prescription form
    setSelectedMedicines([]);
    setDiagnosis('');
    setActivePrintPrescription(newRx);
  };

  const handleSaveClinicalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    await addClinicalNote(patient.id, {
      patientId: patient.id,
      chiefComplaint: chiefComplaint || patient.chiefComplaint,
      clinicalExamination: clinicalExam,
      radiographicFindings,
      proposedTreatment,
      chairNumber,
      attendingDoctor: 'Dr. Smita Bevle'
    });

    setClinicalExam('');
    setRadiographicFindings('');
    setProposedTreatment('');
    alert('Clinical notes saved by Dr. Smita Bevle.');
  };

  const handleQuickAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPatientPhone) return;
    const added = await addPatient({
      name: newPatientName,
      phone: newPatientPhone,
      age: Number(newPatientAge),
      gender: newPatientGender,
      chiefComplaint: 'General dental checkup'
    });
    if (!added) return;
    setSelectedPatientId(added.id);
    setIsQuickAddOpen(false);
    setNewPatientName('');
    setNewPatientPhone('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>PATIENT DIRECTORY & EHR MANAGEMENT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Patient Database, Odontogram & Clinical Notes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Full patient CRUD operations, 32-tooth anatomical condition charting, and electronic prescription authoring.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient (CRUD: Create)</span>
        </button>
      </div>

      {/* Main Split Layout: Patient Directory on left, Active Patient Record on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Patient List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID code, phone..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">
            <span>Registered Patients ({filteredPatients.length})</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => {
              const isSelected = p.id === patient?.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setIsEditing(false);
                  }}
                  className={`w-full p-4 rounded-2xl text-left transition border cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{p.name}</span>
                    <span className="text-[10px] font-mono text-indigo-800 font-bold bg-indigo-100/70 px-2 py-0.5 rounded-full">
                      {p.patientIdCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">{p.phone}</div>
                  <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                    <span>{p.age} Yrs • {p.gender}</span>
                    {p.balanceDue > 0 ? (
                      <span className="text-rose-600 font-bold font-mono">Due: ${p.balanceDue}</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">Cleared</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Patient View & Workspace (8 cols) */}
        {patient ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Patient Header Card */}
            <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm shadow-indigo-500/30">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">{patient.name}</h3>
                      <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        {patient.patientIdCode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap gap-2 mt-1">
                      <span>{patient.age} Yrs</span>
                      <span>•</span>
                      <span>{patient.gender}</span>
                      <span>•</span>
                      <span>Blood Group: <strong className="text-slate-800">{patient.bloodGroup}</strong></span>
                      <span>•</span>
                      <span className="font-mono">{patient.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Patient CRUD Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleStartEdit}
                    className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    title="Edit Patient Demographics (CRUD: Update)"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Permanently delete patient ${patient.name} and all associated history?`)) {
                        deletePatient(patient.id);
                      }
                    }}
                    className="p-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                    title="Delete Patient Record (CRUD: Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Medical Alerts & Chief Complaint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Medical Alerts
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {patient.medicalAlerts.length > 0 ? (
                      patient.medicalAlerts.map((m) => (
                        <span key={m} className="px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-950 font-bold text-[10px]">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[11px]">No adverse medical conditions noted.</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Chief Dental Complaint
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">{patient.chiefComplaint}</p>
                </div>
              </div>

              {/* Sub-Tabs: Pill style matching image.png */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 text-xs font-bold">
                <button
                  onClick={() => setActiveSubTab('chart')}
                  className={`flex-1 py-2 px-3 rounded-full transition cursor-pointer text-center ${
                    activeSubTab === 'chart' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  32-Tooth Odontogram
                </button>
                <button
                  onClick={() => setActiveSubTab('notes')}
                  className={`flex-1 py-2 px-3 rounded-full transition cursor-pointer text-center ${
                    activeSubTab === 'notes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clinical Notes Pad
                </button>
                <button
                  onClick={() => setActiveSubTab('rx')}
                  className={`flex-1 py-2 px-3 rounded-full transition cursor-pointer text-center ${
                    activeSubTab === 'rx' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Prescription Generator
                </button>
                {isEditing && (
                  <button
                    onClick={() => setActiveSubTab('edit')}
                    className="flex-1 py-2 px-3 rounded-full transition cursor-pointer text-center bg-white text-indigo-900 shadow-xs"
                  >
                    Edit Demographics
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: 32-Tooth Odontogram */}
            {activeSubTab === 'chart' && (
              <div className="space-y-4">
                <Odontogram
                  dentalChart={patient.dentalChart}
                  onToothClick={(num, cond) => {
                    const conditions: ToothCondition[] = ['healthy', 'caries', 'filled', 'rct', 'crown', 'missing', 'implant'];
                    const nextIndex = (conditions.indexOf(cond) + 1) % conditions.length;
                    updateToothCondition(patient.id, num, conditions[nextIndex]);
                  }}
                  interactive={true}
                />
                <div className="p-4 bg-indigo-50/70 rounded-3xl border border-indigo-150 text-xs text-indigo-950 flex items-center justify-between">
                  <span>Click on any tooth above to toggle conditions (Healthy, Caries, RCT, Crown, Implant, Missing).</span>
                  <span className="font-bold text-[11px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                    Synchronized Live
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: Clinical Notes Pad */}
            {activeSubTab === 'notes' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-base text-slate-900">Dr. Smita Bevle's Clinical Notes</h4>
                    <p className="text-slate-500 text-[11px]">Chair-side operative documentation & diagnosis</p>
                  </div>
                  <span className="text-[11px] text-indigo-700 font-mono font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-150">
                    Operatory CH-1
                  </span>
                </div>

                <form onSubmit={handleSaveClinicalNote} className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Clinical Findings & Examination</label>
                    <textarea
                      rows={2}
                      required
                      value={clinicalExam}
                      onChange={(e) => setClinicalExam(e.target.value)}
                      placeholder="e.g. Deep disto-occlusal decay #30, tenderness to percussion, vitality test..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Radiographic / RVG Evaluation</label>
                      <input
                        type="text"
                        value={radiographicFindings}
                        onChange={(e) => setRadiographicFindings(e.target.value)}
                        placeholder="e.g. Radiolucency approaching pulp horn #30"
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Proposed Treatment Plan</label>
                      <input
                        type="text"
                        required
                        value={proposedTreatment}
                        onChange={(e) => setProposedTreatment(e.target.value)}
                        placeholder="e.g. Root Canal Therapy followed by Ceramic Crown"
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/25"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Clinical Findings to EHR</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: Prescription Generator */}
            {activeSubTab === 'rx' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-base text-slate-900">Digital Prescription Builder</h4>
                    <p className="text-slate-500 text-[11px]">Authored by Dr. Smita Bevle (Reg: D-48921-MMC)</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    Official Rx Letterhead
                  </span>
                </div>

                <form onSubmit={handleSavePrescription} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Diagnosis</label>
                      <input
                        type="text"
                        required
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="e.g. Acute Pulpitis #30"
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">BP Vitals</label>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Pulse Vitals</label>
                      <input
                        type="text"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Standard Dental Drugs Quick Inserter */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Quick-Insert Standard Dental Regimen:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {STANDARD_DENTAL_DRUGS.map((drug) => (
                        <button
                          key={drug.name}
                          type="button"
                          onClick={() => handleAddQuickDrug(drug)}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200/80 text-[11px] font-semibold transition cursor-pointer"
                        >
                          + {drug.name.split(' ')[0]} ({drug.strength})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Medications Table */}
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/20">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100/70 border-b border-slate-200 font-bold text-slate-700 text-xs">
                        <tr>
                          <th className="py-2.5 px-4">Medication</th>
                          <th className="py-2.5 px-4">Dosage</th>
                          <th className="py-2.5 px-4">Duration</th>
                          <th className="py-2.5 px-4">Timing</th>
                          <th className="py-2.5 px-4 text-right">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedMedicines.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-5 text-center text-slate-400">
                              No medications added yet. Click from quick drugs above.
                            </td>
                          </tr>
                        ) : (
                          selectedMedicines.map((m) => (
                            <tr key={m.id}>
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {m.name} <span className="text-indigo-600 font-mono text-[11px]">({m.strength})</span>
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-800">{m.dosage}</td>
                              <td className="py-3 px-4 text-slate-600">{m.duration}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                                  {m.timing}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMed(m.id)}
                                  className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Doctor's Advice</label>
                      <input
                        type="text"
                        value={generalAdvice}
                        onChange={(e) => setGeneralAdvice(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Next Follow-Up</label>
                      <input
                        type="text"
                        value={nextFollowUp}
                        onChange={(e) => setNextFollowUp(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/25"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Issue & Print Official Rx (CRUD)</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: Edit Demographics (CRUD: Update) */}
            {activeSubTab === 'edit' && (
              <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-black text-base text-slate-900">Update Patient Profile (CRUD: Update)</h4>
                  <span className="text-[11px] text-indigo-700 font-mono font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    ID: {patient.patientIdCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Age</label>
                    <input
                      type="number"
                      required
                      value={editFormData.age}
                      onChange={(e) => setEditFormData({ ...editFormData, age: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Blood Group</label>
                    <select
                      value={editFormData.bloodGroup}
                      onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setActiveSubTab('chart');
                    }}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/25"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Demographic Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : null}
      </div>

      {/* Quick Add Patient Modal (CRUD: Create) */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl sm:rounded-[2rem] max-w-sm w-full p-6 sm:p-8 shadow-2xl space-y-4 text-xs border border-slate-100">
            <h3 className="font-black text-lg text-slate-900">Add New Patient (CRUD)</h3>
            <form onSubmit={handleQuickAddPatient} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition shadow-sm shadow-indigo-500/25"
                >
                  Create Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
