import React from 'react';

export type AuthVariant = 'patient' | 'doctor';

// Full class names are written out so Tailwind can detect them.
const THEME: Record<
  AuthVariant,
  { page: string; icon: string; iconShadow: string; badge: string | null; badgeClass: string }
> = {
  patient: {
    page: 'from-slate-50 via-indigo-50/20 to-purple-50/30',
    icon: 'from-indigo-500 to-purple-600',
    iconShadow: 'shadow-indigo-500/20',
    badge: 'Patient Portal',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  doctor: {
    page: 'from-slate-50 via-purple-50/40 to-slate-100',
    icon: 'from-purple-600 to-indigo-700',
    iconShadow: 'shadow-purple-500/25',
    badge: 'Doctor Portal',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
  }
};

interface AuthShellProps {
  variant: AuthVariant;
  children: React.ReactNode;
}

/** Shared page background, clinic branding header and footer for every login screen. */
export const AuthShell: React.FC<AuthShellProps> = ({ variant, children }) => {
  const theme = THEME[variant];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.page} flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8`}
    >
      {/* Decorative subtle backdrop elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr ${theme.icon} text-white shadow-xl ${theme.iconShadow} mb-3`}
          >
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8 2 5 5 5 9c0 3.5 1.5 6 3 9.5.8 1.8 1.5 3.5 4 3.5s3.2-1.7 4-3.5C17.5 15 19 12.5 19 9c0-4-3-7-7-7z" />
              <path d="M9 10c.8 0 1.5.7 1.5 1.5S9.8 13 9 13s-1.5-.7-1.5-1.5S8.2 10 9 10z" />
              <path d="M15 10c.8 0 1.5.7 1.5 1.5S15.8 13 15 13s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smita Dental Clinic</h1>
          <p className="text-xs font-bold text-indigo-700 mt-1 uppercase tracking-wider">
            Dr. Smita Bevle (BDS, MDS) • Sole Dental Surgeon
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Advanced Prosthodontics, Dental Implants & Laser Dentistry Center
          </p>
          {theme.badge && (
            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${theme.badgeClass}`}
            >
              {theme.badge}
            </span>
          )}
        </div>

        {children}

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Smita Dental Clinic • Dr. Smita Bevle (BDS, MDS) • Sole Practitioner • Private & Secure Healthcare Portal
        </p>
      </div>
    </div>
  );
};
