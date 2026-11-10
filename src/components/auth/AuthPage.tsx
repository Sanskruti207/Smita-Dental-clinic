import React from 'react';
import { usePathname, ROUTES } from '../../utils/authRoute';
import { HomePage } from './HomePage';
import { PatientLoginPage } from './PatientLoginPage';
import { DoctorLoginPage } from './DoctorLoginPage';

/**
 * Entry point for everything shown before sign-in. Picks the screen from the address bar:
 *   /patient/login  -> PatientLoginPage   (customers: sign in + new registration)
 *   /doctor/login   -> DoctorLoginPage    (doctor only)
 *   anything else   -> HomePage           (public clinic overview, no login needed)
 */
export const AuthPage: React.FC = () => {
  const pathname = usePathname().replace(/\/+$/, '') || ROUTES.home;

  if (pathname === ROUTES.patientLogin) return <PatientLoginPage />;
  if (pathname === ROUTES.doctorLogin) return <DoctorLoginPage />;
  return <HomePage />;
};
