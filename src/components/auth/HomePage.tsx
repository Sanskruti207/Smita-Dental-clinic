import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Stethoscope,
  Sparkles,
  HeartPulse,
  ShieldCheck,
  Activity,
  CalendarCheck
} from 'lucide-react';
import { AuthLink } from './AuthLink';
import { ROUTES } from '../../utils/authRoute';

// ===== EDIT CLINIC DETAILS HERE =====
const CLINIC = {
  name: 'Smita Dental Clinic',
  doctor: 'Dr. Smita Bevle',
  degree: 'BDS, MDS',
  tagline: 'Advanced Prosthodontics, Dental Implants & Laser Dentistry Center',
  phone: '+91 96075 21551',
  phoneLink: 'tel:+919607521551',
  whatsappLink: 'https://wa.me/919607521551',
  email: 'warpesmita@gmail.com',
  addressLines: ['Office Number 03, Anirudh Plaza,', 'Behind Indariyani Medical, Nashik – 422010,', 'Maharashtra, India'],
  timings: [
    { days: 'Mon – Sat (Morning)', time: '9 AM – 1 PM' },
    { days: 'Mon – Sat (Evening)', time: '4 PM – 8 PM' },
    { days: 'Sunday', time: '10 AM – 1 PM' }
  ]
};

const SERVICES = [
  { icon: HeartPulse, title: 'Dental Implants', text: 'Titanium implant surgery to replace missing teeth with a natural look and strong bite.' },
  { icon: ShieldCheck, title: 'Prosthodontics', text: 'Crowns, bridges and dentures planned and fitted by a prosthodontic specialist.' },
  { icon: Sparkles, title: 'Laser Teeth Whitening', text: 'In-office laser whitening for a brighter, aesthetic smile.' },
  { icon: Activity, title: 'Root Canal Therapy', text: 'Single-visit rotary root canal treatment to save your natural tooth.' },
  { icon: Stethoscope, title: 'Scaling & Polishing', text: 'Ultrasonic scaling and polishing for healthy gums and fresh breath.' },
  { icon: CalendarCheck, title: 'Check-ups & Records', text: 'Digital dental records, prescriptions and bills available in your patient portal.' }
];

const mapsLink =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Anirudh Plaza, Behind Indariyani Medical, Nashik 422010');

/** Public first page ("/"): anyone can see it without logging in. */
export const HomePage: React.FC = () => (
  <div className="min-h-screen bg-white text-slate-900">
    {/* Top navigation */}
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <AuthLink to={ROUTES.home} className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </span>
          <span className="font-black tracking-tight text-slate-900">{CLINIC.name}</span>
        </AuthLink>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <a href="#about" className="hover:text-indigo-700">About</a>
          <a href="#services" className="hover:text-indigo-700">Services</a>
          <a href="#timings" className="hover:text-indigo-700">Timings</a>
          <a href="#contact" className="hover:text-indigo-700">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <AuthLink
            to={ROUTES.doctorLogin}
            className="px-3.5 py-2 rounded-full text-xs font-bold border border-purple-200 text-purple-700 hover:bg-purple-50 transition"
          >
            Doctor Login
          </AuthLink>
          <AuthLink
            to={ROUTES.patientLogin}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition"
          >
            Patient Login
          </AuthLink>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          Nashik • Dental Care You Can Trust
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight text-slate-900">{CLINIC.name}</h1>
        <p className="mt-3 text-sm sm:text-base font-bold text-indigo-700 uppercase tracking-wider">
          {CLINIC.doctor} ({CLINIC.degree}) • Sole Dental Surgeon
        </p>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">{CLINIC.tagline}</p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <AuthLink
            to={ROUTES.patientLogin}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </AuthLink>
          <a
            href={CLINIC.phoneLink}
            className="px-6 py-3 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call {CLINIC.phone}</span>
          </a>
        </div>
      </div>
    </section>

    {/* About */}
    <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-16">
      <h2 className="text-2xl font-black text-slate-900 text-center">About the Clinic</h2>
      <p className="mt-4 text-sm text-slate-600 max-w-3xl mx-auto text-center leading-relaxed">
        {CLINIC.name} is led by {CLINIC.doctor} ({CLINIC.degree}), who personally treats every patient.
        The clinic focuses on prosthodontics, dental implants and laser dentistry, with a simple online
        portal where patients can book appointments and view their records, prescriptions and bills.
      </p>
    </section>

    {/* Services */}
    <section id="services" className="bg-slate-50 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-black text-slate-900 text-center">Our Services</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{s.title}</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Timings + Contact */}
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div id="timings" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200 p-6">
        <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>Clinic Timings</span>
        </h2>
        <ul className="mt-4 divide-y divide-slate-100 text-sm">
          {CLINIC.timings.map((t) => (
            <li key={t.days} className="py-2.5 flex items-center justify-between gap-4">
              <span className="text-slate-600">{t.days}</span>
              <span className="font-bold text-slate-900">{t.time}</span>
            </li>
          ))}
        </ul>
      </div>

      <div id="contact" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200 p-6">
        <h2 className="text-lg font-black text-slate-900">Contact Us</h2>
        <ul className="mt-4 space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <Phone className="w-4 h-4 mt-0.5 text-indigo-600 shrink-0" />
            <div>
              <a href={CLINIC.phoneLink} className="font-bold text-slate-900 hover:text-indigo-700">{CLINIC.phone}</a>
              <div>
                <a href={CLINIC.whatsappLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 hover:underline">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="w-4 h-4 mt-0.5 text-indigo-600 shrink-0" />
            <a href={`mailto:${CLINIC.email}`} className="font-bold text-slate-900 hover:text-indigo-700">{CLINIC.email}</a>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="w-4 h-4 mt-0.5 text-indigo-600 shrink-0" />
            <div>
              {CLINIC.addressLines.map((l) => (
                <div key={l} className="text-slate-700">{l}</div>
              ))}
              <a href={mapsLink} target="_blank" rel="noreferrer" className="inline-block mt-1 text-xs font-bold text-indigo-700 hover:underline">
                View on Google Maps
              </a>
            </div>
          </li>
        </ul>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {CLINIC.name} • {CLINIC.doctor} ({CLINIC.degree}) • Nashik, Maharashtra
      </div>
    </footer>
  </div>
);
