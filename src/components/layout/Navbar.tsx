import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Menu,
  X,
  Stethoscope,
  User,
  LogOut,
  Bell,
  RotateCcw,
  Sparkles,
  Calendar,
  CalendarDays,
  FileText,
  Receipt,
  Activity,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { PatientTabId, DoctorTabId } from '../../types/clinic';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    currentRole,
    selectedPatient,
    patientTab,
    setPatientTab,
    doctorTab,
    setDoctorTab,
    visibleNotifications,
    setIsNotificationDrawerOpen,
    refreshData,
    invoices,
    appointments,
    prescriptions
  } = useClinic();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDoctor = currentRole === 'doctor';
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled');

  const myInvoices = selectedPatient
    ? invoices.filter((i) => i.patientId === selectedPatient.id)
    : [];
  const myUnpaid = myInvoices.filter((i) => i.status !== 'paid');

  const handleSelectPatientTab = (tab: PatientTabId) => {
    setPatientTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleSelectDoctorTab = (tab: DoctorTabId) => {
    setDoctorTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 pt-3 pb-2 px-3 sm:px-6 no-print">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-full px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4 transition-all">
          
          {/* Left: Mobile Menu Button & Brand Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Pill (Styled like IBNESINA in screenshot) */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/70 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8 2 5 5 5 9c0 3.5 1.5 6 3 9.5.8 1.8 1.5 3.5 4 3.5s3.2-1.7 4-3.5C17.5 15 19 12.5 19 9c0-4-3-7-7-7z" />
                </svg>
              </div>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide">
                Smita Dental
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Pills (Styled exactly like image.png's Home, Contribution, Our Mission pills) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-full border border-slate-200/50">
            {!isDoctor ? (
              <>
                <button
                  onClick={() => handleSelectPatientTab('patient-dashboard')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    patientTab === 'patient-dashboard'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${patientTab === 'patient-dashboard' ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
                  <span>Home</span>
                </button>

                <button
                  onClick={() => handleSelectPatientTab('patient-book')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    patientTab === 'patient-book'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Book Visit</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-bold">
                    Live
                  </span>
                </button>

                <button
                  onClick={() => handleSelectPatientTab('patient-records')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    patientTab === 'patient-records'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Records & Rx</span>
                </button>

                <button
                  onClick={() => handleSelectPatientTab('patient-billing')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    patientTab === 'patient-billing'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5 text-indigo-500" />
                  <span>My Invoices</span>
                  {myUnpaid.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-100 text-rose-800 font-bold">
                      {myUnpaid.length} Due
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSelectDoctorTab('dr-analytics')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    doctorTab === 'dr-analytics'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${doctorTab === 'dr-analytics' ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => handleSelectDoctorTab('dr-schedule')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    doctorTab === 'dr-schedule'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Master Schedule</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-100 text-indigo-800 font-bold">
                    {todayApts.length}
                  </span>
                </button>

                <button
                  onClick={() => handleSelectDoctorTab('dr-patients')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    doctorTab === 'dr-patients'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Patient Database</span>
                </button>

                <button
                  onClick={() => handleSelectDoctorTab('dr-billing')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    doctorTab === 'dr-billing'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Billing & Ledger</span>
                </button>
              </>
            )}
          </nav>

          {/* Right: Notifications, User Profile & Soft Accent Pill Action Button */}
          <div className="flex items-center gap-2">
            {/* User identity chip */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isDoctor ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
              <span className="font-bold text-slate-800 truncate max-w-[120px]">
                {isDoctor ? 'Dr. Smita Bevle' : (currentUser?.name || selectedPatient?.name)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">
                {isDoctor ? 'MMC D-48921' : selectedPatient?.bloodGroup || 'Patient'}
              </span>
            </div>

            {/* Notification Drawer Trigger */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              title="Notifications"
              className="relative p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              <Bell className="w-4 h-4 text-indigo-600" />
              {visibleNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {visibleNotifications.length}
                </span>
              )}
            </button>

            {/* Refresh Data Button */}
            <button
              onClick={refreshData}
              title="Refresh data from server"
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer hidden xl:flex items-center justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Soft Accent Button (Like Contact Us in screenshot) -> Sign Out */}
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-xs shadow-indigo-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Mobile Frosted Dropdown Menu (when toggled on small screens) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-xl space-y-2 animate-in fade-in duration-200">
            <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                {isDoctor ? 'Dr. Smita Bevle (Doctor Console)' : 'Patient Portal'}
              </span>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                {isDoctor ? 'MMC D-48921' : selectedPatient?.patientIdCode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {!isDoctor ? (
                <>
                  <button
                    onClick={() => handleSelectPatientTab('patient-dashboard')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      patientTab === 'patient-dashboard'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span>• Home</span>
                  </button>
                  <button
                    onClick={() => handleSelectPatientTab('patient-book')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      patientTab === 'patient-book'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Visit</span>
                  </button>
                  <button
                    onClick={() => handleSelectPatientTab('patient-records')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      patientTab === 'patient-records'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Records & Rx</span>
                  </button>
                  <button
                    onClick={() => handleSelectPatientTab('patient-billing')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      patientTab === 'patient-billing'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    <span>My Invoices</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSelectDoctorTab('dr-analytics')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      doctorTab === 'dr-analytics'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => handleSelectDoctorTab('dr-schedule')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      doctorTab === 'dr-schedule'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Master Schedule</span>
                  </button>
                  <button
                    onClick={() => handleSelectDoctorTab('dr-patients')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      doctorTab === 'dr-patients'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Patients (CRUD)</span>
                  </button>
                  <button
                    onClick={() => handleSelectDoctorTab('dr-billing')}
                    className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      doctorTab === 'dr-billing'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Billing & Ledger</span>
                  </button>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={refreshData}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Refresh Data
              </button>
              <button
                onClick={logout}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
