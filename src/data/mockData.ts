import { ToothCondition } from '../types/clinic';

export const getDefaultToothChart = (): Record<number, ToothCondition> => {
  const chart: Record<number, ToothCondition> = {};
  for (let i = 1; i <= 32; i++) {
    chart[i] = 'healthy';
  }
  return chart;
};

/**
 * Static reference data used by the forms (price list, common drugs).
 * Patients, appointments, invoices and prescriptions are NOT stored here any more - they come from the Spring Boot API.
 */
export const DENTAL_TARIFF_ITEMS = [
  { code: 'CON-01', description: 'Comprehensive Oral Consultation & RVG', price: 40 },
  { code: 'RAD-01', description: 'Digital RVG Periapical X-Ray', price: 25 },
  { code: 'RAD-02', description: 'Full Mouth Panoramic OPG X-Ray', price: 55 },
  { code: 'SCL-01', description: 'Ultrasonic Scaling & Dental Polishing', price: 85 },
  { code: 'RES-01', description: 'Composite Restorative Filling (Light Cure)', price: 110 },
  { code: 'RCT-01', description: 'Single-Visit Rotary Root Canal Therapy', price: 320 },
  { code: 'CRN-01', description: 'Monolithic Zirconia CAD/CAM Crown', price: 450 },
  { code: 'EXT-01', description: 'Surgical Wisdom Tooth Impaction Extraction', price: 220 },
  { code: 'IMP-01', description: 'Titanium Dental Implant Surgery (Stage 1)', price: 850 },
  { code: 'BLC-01', description: 'In-Office Laser Teeth Whitening', price: 300 }
];

export const STANDARD_DENTAL_DRUGS = [
  { name: 'Augmentin (Amoxicillin + Clavulanic Acid)', strength: '625 mg', defaultDosage: '1 tab 3 times daily (TDS)', defaultDuration: '5 Days', timing: 'After Food' as const, note: 'Complete full antibiotic course.' },
  { name: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)', strength: '100mg/325mg/15mg', defaultDosage: '1 tab twice daily (BD)', defaultDuration: '3 Days', timing: 'After Food' as const, note: 'Take after meal for relief from discomfort and swelling.' },
  { name: 'Chlorhexidine Gluconate 0.2% Mouthwash', strength: '0.2% w/v', defaultDosage: '10 ml rinse twice daily', defaultDuration: '7 Days', timing: 'After Food' as const, note: 'Swish for 60 seconds; do not rinse with plain water immediately.' },
  { name: 'Pantocid (Pantoprazole)', strength: '40 mg', defaultDosage: '1 tab once daily', defaultDuration: '5 Days', timing: 'Before Food' as const, note: 'Take 30 mins before breakfast.' },
  { name: 'Metrogyl (Metronidazole)', strength: '400 mg', defaultDosage: '1 tab 3 times daily', defaultDuration: '5 Days', timing: 'After Food' as const, note: 'Avoid alcohol completely during course.' }
];
