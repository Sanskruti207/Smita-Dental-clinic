import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Stethoscope,
  Plus,
  ShieldCheck,
  Microscope,
  Pill,
  Syringe,
  FlaskConical,
  Layers,
  FileText
} from 'lucide-react';

export const DoctorOverviewView: React.FC = () => {
  const {
    patients,
    appointments,
    invoices,
    setDoctorTab,
    setIsNewAppointmentModalOpen,
    setSelectedPatientId
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const totalRevenue = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalBalanceDue = invoices.reduce((sum, i) => sum + i.balanceDue, 0);

  // Operatory chairs status
  const chair1Apt = todayAppointments.find((a) => a.chair === 1 && (a.status === 'in-chair' || a.status === 'checked-in'));
  const chair2Apt = todayAppointments.find((a) => a.chair === 2 && (a.status === 'in-chair' || a.status === 'checked-in'));

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* 1. DOCTOR HERO SECTION (Styled like image.png, but differentiated for Doctor) */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[440px] sm:min-h-[500px] flex flex-col justify-between p-6 sm:p-10 shadow-lg shadow-indigo-950/5">
        {/* Background Image: Generated Operatory Dental Surgeon */}
        <img
          src="/src/assets/images/doctor_hero_operatory_1790246536636.jpg"
          alt="Dr. Smita Bevle Dental Operatory"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft Glass / Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/30" />

        {/* Top Badges & Right Widget Container */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Top-left Pill Badge (Doctor specific) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-xs">
            <span className="text-amber-300">★</span>
            <span>Dr. Smita Bevle (BDS, MDS) • Sole Practitioner Console</span>
          </div>

          {/* Top-right Floating Frosted Widget (Doctor Practice Insights) */}
          <div className="w-full sm:w-64 p-4 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/80">Operatory Insights</span>
              <span className="text-[11px] font-bold bg-white/30 px-2 py-0.5 rounded-full text-indigo-200">
                ↗ Live Sync
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-xs flex items-center justify-center border-2 border-white/40">
                DS
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black truncate">Dr. Smita Bevle</div>
                <div className="text-[10px] text-white/70">Lead Prosthodontist & Surgeon</div>
              </div>
            </div>
            <div className="pt-2 border-t border-white/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-white/70">Today's Visits</div>
                <div className="text-sm font-black font-mono">
                  {todayAppointments.length} Booked
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-emerald-300">Chair 1 & 2 Active</div>
                <div className="text-[10px] text-white/70">Sterilized & Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Title & Primary Action Buttons */}
        <div className="relative z-10 max-w-xl my-6 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Advanced Prosthodontics & Operatory Care
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
            Welcome to your master clinical workstation, <strong>Dr. Smita Bevle</strong>. Monitor today's schedule, review patient EHR history, and orchestrate chairside dental procedures.
          </p>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsNewAppointmentModalOpen(true)}
              className="px-5 py-3 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition flex items-center gap-2 cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Book New Appointment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setDoctorTab('dr-schedule')}
              className="px-5 py-3 rounded-full bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Master Operatory Calendar</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Info */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white/50 bg-indigo-500 text-white text-[10px] font-bold text-center leading-7">
                1
              </span>
              <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white/50 bg-purple-500 text-white text-[10px] font-bold text-center leading-7">
                2
              </span>
            </div>
            <div className="text-[11px] text-white/90">
              <span className="font-bold">{patients.length} Patient Records</span> under active management
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Hospital-Grade Autoclave • Zero Infection Protocol</span>
            <span className="hidden md:inline font-bold text-amber-200">MMC D-48921</span>
          </div>
        </div>
      </div>

      {/* 2. OPERATORY CHAIR STATUS & REAL-TIME KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Today's Appointments */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Visits</span>
            <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">{todayAppointments.length}</div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1">
            {todayAppointments.filter((a) => a.status === 'completed').length} completed
          </div>
        </div>

        {/* KPI 2: Total Patients */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Base</span>
            <div className="p-2 rounded-2xl bg-purple-50 text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">{patients.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Registered dental profiles</div>
        </div>

        {/* KPI 3: Revenue Collected */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Collected Revenue</span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-2">${totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Paid in full or partial receipts</div>
        </div>

        {/* KPI 4: Pending Balance */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Balance</span>
            <div className="p-2 rounded-2xl bg-rose-50 text-rose-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono mt-2">${totalBalanceDue.toFixed(2)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Outstanding patient balances</div>
        </div>
      </div>

      {/* Operatory Chairs Live State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chair 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-black text-sm text-slate-900">Operatory Chair 1</span>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              chair1Apt ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {chair1Apt ? `In Session: ${chair1Apt.status.toUpperCase()}` : 'Ready for Next Patient'}
            </span>
          </div>

          {chair1Apt ? (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="font-bold text-slate-900 text-xs">{chair1Apt.patientName}</div>
              <div className="text-[11px] text-indigo-700 font-medium">{chair1Apt.procedure}</div>
              <div className="text-[10px] text-slate-400">Scheduled: {chair1Apt.time} ({chair1Apt.durationMinutes} mins)</div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-3">
              Chair 1 is sterilized and ready for upcoming prosthodontic or crown procedures.
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Equipped: High-speed Handpiece, OPG Feed</span>
            <button
              onClick={() => setDoctorTab('dr-schedule')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              View Schedule
            </button>
          </div>
        </div>

        {/* Chair 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="font-black text-sm text-slate-900">Operatory Chair 2</span>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              chair2Apt ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {chair2Apt ? `In Session: ${chair2Apt.status.toUpperCase()}` : 'Ready for Next Patient'}
            </span>
          </div>

          {chair2Apt ? (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="font-bold text-slate-900 text-xs">{chair2Apt.patientName}</div>
              <div className="text-[11px] text-indigo-700 font-medium">{chair2Apt.procedure}</div>
              <div className="text-[10px] text-slate-400">Scheduled: {chair2Apt.time} ({chair2Apt.durationMinutes} mins)</div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-3">
              Chair 2 is sterilized and ready for hygiene, cleanings, or consultations.
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Equipped: Ultrasonic Scaler, Curing Light</span>
            <button
              onClick={() => setDoctorTab('dr-schedule')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* 3. CLINICAL TREATMENT CATEGORIES (Styled in soft pastel cards as in screenshot) */}
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Specialized Clinical Treatment Disciplines
          </h2>
          <div className="mt-2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <span>Operatory Protocols</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 text-left">
          {/* Diagnostic 3D */}
          <div className="p-5 rounded-3xl bg-sky-50/70 border border-sky-150 hover:bg-sky-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-sky-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">3D Radiography</div>
              <div className="text-[11px] text-slate-500 mt-1">Digital OPG & Panoramic Scan</div>
            </div>
          </div>

          {/* Prosthodontics (highlighted lavender) */}
          <div className="p-5 rounded-3xl bg-purple-50/80 border-2 border-purple-200 hover:bg-purple-100/70 shadow-sm transition-all flex flex-col justify-between space-y-4 scale-[1.02]">
            <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 shadow-2xs flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">Prosthodontics</div>
              <div className="text-[11px] text-purple-900 mt-1">Zirconia Crowns & Bridges</div>
            </div>
          </div>

          {/* Hygiene */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-150 hover:bg-emerald-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-emerald-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Preventive Hygiene</div>
              <div className="text-[11px] text-slate-500 mt-1">Ultrasonic Polishing & Bleach</div>
            </div>
          </div>

          {/* Endodontics */}
          <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-150 hover:bg-indigo-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-indigo-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Endodontics</div>
              <div className="text-[11px] text-slate-500 mt-1">Rotary Root Canal Therapy</div>
            </div>
          </div>

          {/* Implants */}
          <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-150 hover:bg-blue-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Implantology</div>
              <div className="text-[11px] text-slate-500 mt-1">Guided Flapless Surgery</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CLINICAL ACCREDITATIONS & AWARDS (Matching screenshot's bottom section!) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Clinical Accreditations & Standards
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Recognized protocols in sterile surgical preparation, electronic health privacy, and computerized dentistry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Laboratory Photo with Learn More */}
          <div className="lg:col-span-5 relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[280px] shadow-sm">
            <img
              src="/src/assets/images/dental_lab_research_1790246552592.jpg"
              alt="Dental lab precision research"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <div className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span>CAD/CAM Precision Milling</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-white/80 font-mono">Restorative Lab</span>
            </div>
          </div>

          {/* Right: Stack of Rounded Cards with Lavender Gradient */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3">
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-between gap-4 group">
              <div className="space-y-1">
                <div className="font-extrabold text-base sm:text-lg">
                  Digital Dental Excellence Award
                </div>
                <div className="text-xs text-indigo-100 max-w-md leading-relaxed">
                  Acknowledging Dr. Smita Bevle's pioneering adoption of painless 3D intraoral optical scanning and bio-inert zirconia crowns.
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 group cursor-pointer">
              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  Sole Attending Dental Surgeon — Dr. Smita Bevle (BDS, MDS)
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Over 14,000 successful restorative procedures performed with zero surgical complications.
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 group cursor-pointer">
              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  Strict Hospital Sterilization & Bio-Medical Waste Clearance
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Fully verified class B autoclave vacuum cycles with digital chemical indicators.
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
