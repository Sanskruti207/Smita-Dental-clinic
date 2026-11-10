import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PatientRegistrationInput } from '../../types/clinic';
import { User, Lock, Mail, AlertCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { AuthLink } from './AuthLink';
import { ROUTES } from '../../utils/authRoute';

/**
 * Patient (customer) login + new patient registration.
 * The doctor account cannot sign in here - the doctor uses /doctor/login.
 */
export const PatientLoginPage: React.FC = () => {
  const { login, registerPatientWithAccount } = useClinic();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign Up / New Patient Comprehensive Registration State
  const [formData, setFormData] = useState<PatientRegistrationInput>({
    name: '',
    age: 30,
    gender: 'Male',
    phone: '',
    email: '',
    password: '',
    address: '',
    bloodGroup: 'B+',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: 'Spouse',
    medicalAlerts: [],
    chiefComplaint: '',
    previousDentalHistory: ''
  });

  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  const availableMedicalAlerts = [
    'Type II Diabetes',
    'Hypertension',
    'Cardiac Pacemaker / Heart Condition',
    'Penicillin / Amoxicillin Allergy',
    'Latex Allergy',
    'Bleeding Disorder / Anticoagulants',
    'Asthmatic',
    'Pregnancy'
  ];

  const handleToggleAlert = (alert: string) => {
    setFormData((prev) => {
      const exists = prev.medicalAlerts.includes(alert);
      return {
        ...prev,
        medicalAlerts: exists
          ? prev.medicalAlerts.filter((a) => a !== alert)
          : [...prev.medicalAlerts, alert]
      };
    });
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail) {
      setLoginError('Please enter your email address.');
      return;
    }
    const result = await login(loginEmail, loginPassword, 'patient');
    if (!result.success) {
      setLoginError(result.message || 'Sign in failed. Please try again.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required contact and demographic details.');
      return;
    }
    if (!formData.chiefComplaint) {
      alert('Please briefly state your primary dental concern or reason for visit.');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      alert('Please choose a password of at least 8 characters.');
      return;
    }

    // The server enforces one account per email address and returns a clear message if it is taken
    const result = await registerPatientWithAccount(formData);
    if (!result.success) {
      setSignupStep(1);
    }
  };

  return (
    <AuthShell variant="patient">
      {/* Main Card Container */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Top Auth Mode Tabs (Sign In vs Register) */}
        <div className="grid grid-cols-2 border-b border-slate-100 text-xs font-bold">
          <button
            onClick={() => setAuthMode('signin')}
            className={`py-4 text-center transition cursor-pointer ${
              authMode === 'signin'
                ? 'border-b-2 border-indigo-600 text-indigo-900 bg-indigo-50/40'
                : 'text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            Patient Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`py-4 text-center transition cursor-pointer ${
              authMode === 'signup'
                ? 'border-b-2 border-indigo-600 text-indigo-900 bg-indigo-50/40'
                : 'text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            New Patient Registration
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* 1. PATIENT SIGN IN FLOW */}
          {authMode === 'signin' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-indigo-950">Patient Login</h2>
                  <p className="text-[11px] text-slate-500">
                    Access your appointments, records, prescriptions and bills
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Patient Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
                <p>
                  First time visiting Smita Dental Clinic?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Register as a New Patient
                  </button>
                </p>
                <p>
                  Are you the doctor?{' '}
                  <AuthLink to={ROUTES.doctorLogin} className="font-bold text-purple-700 hover:underline">
                    Go to Doctor Login
                  </AuthLink>
                </p>
                <p>
                  <AuthLink to={ROUTES.home} className="text-slate-400 hover:text-slate-700 hover:underline">
                    ← Back to Home
                  </AuthLink>
                </p>
              </div>
            </div>
          )}

          {/* 2. COMPREHENSIVE NEW PATIENT INTAKE FORM (FEED DIRECTLY TO DATABASE) */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>New Patient Electronic Registration Intake</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Please provide all required clinical & demographic details. This will automatically feed into Dr. Smita Bevle's database.
                </p>
              </div>

              {signupStep === 1 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Legal Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ananya Deshmukh"
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ananya@example.com"
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={110}
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Portal Password</label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Create login password"
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-mono"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address, Apartment, City"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.name || !formData.phone || !formData.email) {
                          alert('Please complete the contact information first.');
                          return;
                        }
                        setSignupStep(2);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next: Medical History & Chief Complaint</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {signupStep === 2 && (
                <div className="space-y-3 animate-in fade-in">
                  {/* Emergency Contact */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Emergency Contact Person
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Contact Name"
                        required
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Relation (e.g. Spouse)"
                        required
                        value={formData.emergencyContactRelation}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                        className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <input
                        type="tel"
                        placeholder="Emergency Phone"
                        required
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  {/* Medical Alerts Toggle Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Medical Alerts & Health Conditions (Check all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {availableMedicalAlerts.map((alert) => {
                        const checked = formData.medicalAlerts.includes(alert);
                        return (
                          <button
                            type="button"
                            key={alert}
                            onClick={() => handleToggleAlert(alert)}
                            className={`p-2 rounded-xl text-left text-[11px] font-semibold transition border cursor-pointer flex items-center justify-between ${
                              checked
                                ? 'bg-rose-50 border-rose-300 text-rose-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{alert}</span>
                            {checked && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chief Dental Concern */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chief Dental Concern / Reason for Visit <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.chiefComplaint}
                      onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                      placeholder="e.g. Toothache in lower molar, bleeding gums, aesthetic consultation..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Previous Dental History */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Past Dental Treatment History (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.previousDentalHistory}
                      onChange={(e) => setFormData({ ...formData, previousDentalHistory: e.target.value })}
                      placeholder="e.g. Fillings 2 years ago, braces, wisdom teeth extracted..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Registration & Enter Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </AuthShell>
  );
};
