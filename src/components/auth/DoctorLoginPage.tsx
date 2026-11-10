import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Stethoscope, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { AuthLink } from './AuthLink';
import { ROUTES } from '../../utils/authRoute';

/** Doctor-only login (Dr. Smita Bevle). Patients cannot sign in here and there is no registration. */
export const DoctorLoginPage: React.FC = () => {
  const { login } = useClinic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const result = await login(email, password, 'doctor');
    if (!result.success) {
      setError(result.message || 'Sign in failed. Please try again.');
    }
  };

  return (
    <AuthShell variant="doctor">
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-slate-200/80 overflow-hidden">
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 bg-purple-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-purple-950">Doctor Login</h2>
              <p className="text-[11px] text-slate-500">Sign in to the Dr. Smita Workstation</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.smita@dentalclinic.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Dr. Smita Workstation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-1 text-center text-xs text-slate-500 space-y-2">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted to Dr. Smita Bevle (Sole Dental Surgeon).</span>
            </p>
            <p>
              Are you a patient?{' '}
              <AuthLink to={ROUTES.patientLogin} className="font-bold text-indigo-700 hover:underline">
                Go to Patient Login
              </AuthLink>
            </p>
            <p>
              <AuthLink to={ROUTES.home} className="text-slate-400 hover:text-slate-700 hover:underline">
                ← Back to Home
              </AuthLink>
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};
