import React, { useRef } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { DoctorLiveSchedulePicker } from './DoctorLiveSchedulePicker';
import {
  Calendar,
  Clock,
  FileText,
  DollarSign,
  Printer,
  CreditCard,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Download,
  Activity,
  HeartPulse,
  Award,
  Layers,
  FlaskConical,
  Pill,
  Syringe,
  Microscope
} from 'lucide-react';

export const PatientDashboardView: React.FC = () => {
  const {
    selectedPatient,
    appointments,
    invoices,
    prescriptions,
    setPatientTab,
    setActivePrintInvoice,
    setActivePrintPrescription
  } = useClinic();

  const scheduleRef = useRef<HTMLDivElement>(null);

  if (!selectedPatient) return null;

  // Appointments strictly for this patient
  const myAppointments = appointments.filter((a) => a.patientId === selectedPatient.id);
  const upcomingApt = myAppointments.find(
    (a) => a.status === 'scheduled' || a.status === 'checked-in' || a.status === 'in-chair'
  );

  // Invoices strictly for this patient
  const myInvoices = invoices.filter((i) => i.patientId === selectedPatient.id);
  const unpaidInvoices = myInvoices.filter((i) => i.status !== 'paid');
  const totalBalanceDue = unpaidInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

  // Prescriptions strictly for this patient
  const myPrescriptions = prescriptions.filter((r) => r.patientId === selectedPatient.id);
  const latestRx = myPrescriptions[0];

  const scrollToSchedule = () => {
    scheduleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* 1. HERO SECTION (Directly matching user image.png) */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[440px] sm:min-h-[500px] flex flex-col justify-between p-6 sm:p-10 shadow-lg shadow-indigo-950/5">
        {/* Background Image: Generated High-Res Dental Exam */}
        <img
          src="/src/assets/images/patient_hero_dental_1790246517764.jpg"
          alt="Gentle modern dental care"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft Glass / Dark Vignette Overlay for Crisp Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-slate-900/20" />

        {/* Top Badges & Right Widget Container */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Top-left Pill Badge (as in screenshot) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-xs">
            <span className="text-amber-300">★</span>
            <span>24/7 Priority Clinical Support Available</span>
          </div>

          {/* Top-right Floating Frosted Widget (Mirroring "Insights / Monthly Report" in screenshot) */}
          <div className="w-full sm:w-64 p-4 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/80">Oral Health Insights</span>
              <span className="text-[11px] font-bold bg-white/30 px-2 py-0.5 rounded-full text-emerald-200">
                ↗ 94%
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 text-white font-black text-xs flex items-center justify-center border-2 border-white/40">
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black truncate">{selectedPatient.name}</div>
                <div className="text-[10px] text-white/70">
                  {selectedPatient.age ? `${selectedPatient.age} y.o (${selectedPatient.gender})` : 'Active Patient'}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-white/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-white/70">Next Recommended Visit</div>
                <div className="text-sm font-black font-mono">
                  {upcomingApt ? `${upcomingApt.date} • ${upcomingApt.time}` : 'Ready to Book'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-emerald-300">Healthy</div>
                <div className="text-[10px] text-white/70">Tooth Index</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Title & Primary Action Buttons (as in screenshot) */}
        <div className="relative z-10 max-w-xl my-6 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Daily Dental Care for a Healthy Smile
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
            Welcome, <strong>{selectedPatient.name}</strong>. Access your clinical records, digital prescriptions, and view Dr. Smita Bevle's live schedule to book your appointments.
          </p>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* White Pill: Schedule an appointment (scrolls to live schedule) */}
            <button
              onClick={scrollToSchedule}
              className="px-5 py-3 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition flex items-center gap-2 cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Schedule an appointment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Dark/Frosted Pill: Download App / Rx Records */}
            {latestRx ? (
              <button
                onClick={() => setActivePrintPrescription(latestRx)}
                className="px-5 py-3 rounded-full bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>View Latest Rx Prescription</span>
              </button>
            ) : (
              <button
                onClick={() => setPatientTab('patient-records')}
                className="px-5 py-3 rounded-full bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>My Patient Records</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Floating Avatars & Doctor Badge (Mirroring screenshot) */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/15">
          {/* Avatar Cluster */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white/50 bg-indigo-500 text-white text-[10px] font-bold text-center leading-7">
                RS
              </span>
              <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white/50 bg-emerald-500 text-white text-[10px] font-bold text-center leading-7">
                PM
              </span>
              <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white/50 bg-purple-500 text-white text-[10px] font-bold text-center leading-7">
                AP
              </span>
            </div>
            <div className="text-[11px] text-white/90">
              <span className="font-bold">2,500+ happy smiles</span> restored by Dr. Smita Bevle
            </div>
          </div>

          {/* Bottom Center Doctor Commitment Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>We are ready to serve you with pleasure and fast response</span>
            <span className="hidden md:inline font-bold text-amber-200">★ Dr. Smita Bevle (BDS, MDS)</span>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME LIVE OCCUPIED SCHEDULE & BOOKING SECTION (Critical user requirement) */}
      <div ref={scheduleRef}>
        <DoctorLiveSchedulePicker />
      </div>

      {/* 3. EXPLORE OUR KEY TREATMENTS & ACHIEVEMENTS (Directly matching screenshot's middle section!) */}
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore our key treatments and specialized care
          </h2>
          <div className="mt-2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <span>Clinical Treatments</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Soft Pastel Rounded Square Cards Grid (Directly mirroring screenshot layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-left">
          {/* Card 1: Medical Devices (Sky Blue tint) */}
          <div className="p-5 rounded-3xl bg-sky-50/70 border border-sky-150 hover:bg-sky-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-sky-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">3D Diagnostics</div>
              <div className="text-[11px] text-slate-500 mt-1">Digital OPG & Intraoral Imaging</div>
            </div>
          </div>

          {/* Card 2: Medicines / Prosthodontics (Lavender tint - highlighted like screenshot) */}
          <div className="p-5 rounded-3xl bg-purple-50/80 border-2 border-purple-200 hover:bg-purple-100/70 shadow-sm transition-all flex flex-col justify-between space-y-4 scale-[1.02]">
            <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 shadow-2xs flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">Ceramic Crowns</div>
              <div className="text-[11px] text-purple-900 mt-1">Painless Prosthodontics & Veneers</div>
            </div>
          </div>

          {/* Card 3: Vaccines / Preventive (Light Teal/Mint tint) */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-150 hover:bg-emerald-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-emerald-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Hygiene & Laser</div>
              <div className="text-[11px] text-slate-500 mt-1">Stain Removal & Whitening</div>
            </div>
          </div>

          {/* Card 4: Biolaboratories / Endodontics (Cool Gray/Indigo tint) */}
          <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-150 hover:bg-indigo-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-indigo-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Root Canal Care</div>
              <div className="text-[11px] text-slate-500 mt-1">Single-Sitting Endodontics</div>
            </div>
          </div>

          {/* Card 5: Biological Products / Implants (Blue tint) */}
          <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-150 hover:bg-blue-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Dental Implants</div>
              <div className="text-[11px] text-slate-500 mt-1">Titanium Single & Multi-Unit</div>
            </div>
          </div>
        </div>

        {/* Small center text banner */}
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Dr. Smita Bevle develops custom treatment plans ensuring maximum tooth preservation, natural chewing function, and bright aesthetic harmony.
        </p>
      </div>

      {/* 4. AWARDS & RECOGNITION (Directly matching screenshot's bottom section!) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Our clinical excellence & recognition
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            We are proud of our high clinical standards that ensure patient comfort and long-lasting restorative outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Laboratory Photo with Learn More pill (as in screenshot) */}
          <div className="lg:col-span-5 relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[280px] shadow-sm">
            <img
              src="/src/assets/images/dental_lab_research_1790246552592.jpg"
              alt="High precision dental laboratory"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <div className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span>Certified Prosthetic Lab</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-white/80 font-mono">CAD/CAM 3D</span>
            </div>
          </div>

          {/* Right: Stack of Rounded Cards (Top one in gradient lavender as in screenshot!) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3">
            {/* Top Card: Violet / Periwinkle Gradient (Matches screenshot's purple card!) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-between gap-4 group">
              <div className="space-y-1">
                <div className="font-extrabold text-base sm:text-lg">
                  State-of-the-Art Dental Implantology
                </div>
                <div className="text-xs text-indigo-100 max-w-md leading-relaxed">
                  Recognizing precision prosthetic rehabilitation, computerized guided surgery, and a 99.4% clinical success rate.
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Second Card: Clean White Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 group cursor-pointer">
              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  Gold Medalist in Prosthodontics — Dr. Smita Bevle
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Maharashtra Medical Council Reg. D-48921 • Over 14 years of surgical precision.
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Third Card: Clean White Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 group cursor-pointer">
              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  Bio-Compatible Ceramic Materials & Hospital-Grade Sterilization
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Class-B Autoclave spore tested daily for complete hygiene and patient safety.
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SUMMARY ROW: Upcoming Visit & Outstanding Bill Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Next Clinical Appointment Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Your Next Appointment Status
            </span>
            {upcomingApt && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                {upcomingApt.status.toUpperCase()}
              </span>
            )}
          </div>

          {upcomingApt ? (
            <div className="space-y-2">
              <div className="text-lg font-black text-slate-900">{upcomingApt.procedure}</div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-indigo-900">
                  <Calendar className="w-3.5 h-3.5" />
                  {upcomingApt.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                  <Clock className="w-3.5 h-3.5" />
                  {upcomingApt.time}
                </span>
                <span>•</span>
                <span className="text-slate-500">Operatory Chair {upcomingApt.chair}</span>
              </div>
              <p className="text-xs text-slate-500">
                Attending Dental Surgeon: <strong>Dr. Smita Bevle</strong>
              </p>
            </div>
          ) : (
            <div className="py-4 text-center space-y-1">
              <div className="text-sm font-bold text-slate-700">No active appointment booked</div>
              <p className="text-xs text-slate-400">
                Use the live schedule above to reserve an open chair slot with Dr. Smita Bevle.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={scrollToSchedule}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{upcomingApt ? 'Reschedule or View Live Calendar' : 'Book Appointment Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ledger & Outstanding Balance Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Patient Ledger & Invoices
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              totalBalanceDue > 0
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {totalBalanceDue > 0 ? `${unpaidInvoices.length} Due` : 'Account Settled'}
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500">Outstanding Balance</div>
            <div className="text-3xl font-black font-mono text-slate-900 mt-1">
              ${totalBalanceDue.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total of {myInvoices.length} invoices generated for your treatments.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setPatientTab('patient-billing')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Invoices & Pay Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
