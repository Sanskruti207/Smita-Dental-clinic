package com.dentalclinic.config;

import com.dentalclinic.model.*;
import com.dentalclinic.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * CommandLineRunner component that seeds initial realistic clinical data on application startup.
 * Ensures the system is immediately fully usable for mentor demonstrations and viva evaluation.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final ToothRecordRepository toothRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final NotificationRepository notificationRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PatientRepository patientRepository,
                           ToothRecordRepository toothRecordRepository,
                           AppointmentRepository appointmentRepository,
                           InvoiceRepository invoiceRepository,
                           PrescriptionRepository prescriptionRepository,
                           NotificationRepository notificationRepository,
                           org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.toothRecordRepository = toothRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.invoiceRepository = invoiceRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println(">>> Seeding Initial Clinic Data for Mentor Demonstration...");

        // 1. Doctor Profile
        User doctorUser = new User(
                "doc-01",
                "Dr. Smita Bevle",
                "dr.smita@dentalclinic.com",
                "+91 98230 45678",
                passwordEncoder.encode("doctor123"),
                UserRole.DOCTOR,
                null,
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80"
        );
        userRepository.save(doctorUser);

        // 2. Demo Patient 1: Sanskruti Bhosale
        Patient p1 = new Patient();
        p1.setId("pat-101");
        p1.setPatientIdCode("SDC-2026-101");
        p1.setName("Sanskruti Bhosale");
        p1.setAge(24);
        p1.setGender("Female");
        p1.setPhone("+91 98765 43210");
        p1.setEmail("sanskrutiab88@gmail.com");
        p1.setAddress("Flat 402, Shivajinagar, Pune, Maharashtra 411005");
        p1.setBloodGroup("B+");
        p1.setEmergencyContactName("Anand Bhosale");
        p1.setEmergencyContactPhone("+91 98765 43211");
        p1.setEmergencyContactRelation("Father");
        p1.setMedicalAlerts(List.of("Mild Penicillin Allergy", "Sensitive Gums"));
        p1.setChiefComplaint("Toothache in upper right molar (#16) and mild sensitivity while drinking cold water");
        p1.setPreviousDentalHistory("Orthodontic aligners completed in 2024. Routine annual scaling done.");
        p1.setRegistrationDate(LocalDate.now().minusDays(15));
        p1.setLastVisitDate(LocalDate.now().minusDays(3));
        p1.setTotalSpent(new BigDecimal("4500.00"));
        p1.setBalanceDue(new BigDecimal("1200.00"));
        Patient savedP1 = patientRepository.save(p1);

        // Link User account for Patient 1
        User p1User = new User(
                "usr-p101",
                "Sanskruti Bhosale",
                "sanskrutiab88@gmail.com",
                "+91 98765 43210",
                passwordEncoder.encode("patient123"),
                UserRole.PATIENT,
                savedP1.getId(),
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
        );
        userRepository.save(p1User);
        savedP1.setUserId(p1User.getId());
        patientRepository.save(savedP1);

        // Seed 32-tooth chart for Patient 1
        for (int i = 1; i <= 32; i++) {
            ToothCondition cond = ToothCondition.HEALTHY;
            String note = null;
            if (i == 16) {
                cond = ToothCondition.CARIES;
                note = "Deep occlusal caries approaching pulp, sensitivity noted";
            } else if (i == 19) {
                cond = ToothCondition.FILLED;
                note = "Composite composite restoration placed 2024";
            } else if (i == 30) {
                cond = ToothCondition.RCT;
                note = "Root Canal Treatment completed, zirconia crown recommended";
            }
            ToothRecord tr = new ToothRecord("tr-p1-" + i, savedP1.getId(), i, cond, note);
            toothRecordRepository.save(tr);
        }

        // Demo Patient 2: Rajesh Sharma
        Patient p2 = new Patient();
        p2.setId("pat-102");
        p2.setPatientIdCode("SDC-2026-102");
        p2.setName("Rajesh Sharma");
        p2.setAge(48);
        p2.setGender("Male");
        p2.setPhone("+91 98220 11223");
        p2.setEmail("rajesh.sharma@example.com");
        p2.setAddress("Kothrud, Pune, Maharashtra 411038");
        p2.setBloodGroup("O+");
        p2.setEmergencyContactName("Pooja Sharma");
        p2.setEmergencyContactPhone("+91 98220 11224");
        p2.setEmergencyContactRelation("Spouse");
        p2.setMedicalAlerts(List.of("Hypertensive (on Telmisartan 40mg)"));
        p2.setChiefComplaint("Missing lower molar #46; consultation for Osseointegrated Dental Implant");
        p2.setRegistrationDate(LocalDate.now().minusDays(45));
        p2.setTotalSpent(new BigDecimal("18500.00"));
        p2.setBalanceDue(BigDecimal.ZERO);
        Patient savedP2 = patientRepository.save(p2);

        for (int i = 1; i <= 32; i++) {
            ToothCondition cond = (i == 30) ? ToothCondition.MISSING : ToothCondition.HEALTHY;
            ToothRecord tr = new ToothRecord("tr-p2-" + i, savedP2.getId(), i, cond, null);
            toothRecordRepository.save(tr);
        }

        // 3. Appointments (across Chairs 1, 2, 3)
        Appointment apt1 = new Appointment();
        apt1.setId("apt-01");
        apt1.setAppointmentNumber("APT-2026-081");
        apt1.setPatientId(savedP1.getId());
        apt1.setPatientName(savedP1.getName());
        apt1.setPatientPhone(savedP1.getPhone());
        apt1.setDate(LocalDate.now());
        apt1.setTime("10:30 AM");
        apt1.setDurationMinutes(45);
        apt1.setDoctor("Dr. Smita Bevle");
        apt1.setChair(1);
        apt1.setProcedure("Composite Restoration & Pulp Capping (#16)");
        apt1.setStatus(AppointmentStatus.IN_CHAIR);
        apt1.setNotes("Patient seated in Operatory Chair 1. Local anesthesia administered.");
        appointmentRepository.save(apt1);

        Appointment apt2 = new Appointment();
        apt2.setId("apt-02");
        apt2.setAppointmentNumber("APT-2026-082");
        apt2.setPatientId(savedP2.getId());
        apt2.setPatientName(savedP2.getName());
        apt2.setPatientPhone(savedP2.getPhone());
        apt2.setDate(LocalDate.now());
        apt2.setTime("02:00 PM");
        apt2.setDurationMinutes(60);
        apt2.setDoctor("Dr. Smita Bevle");
        apt2.setChair(2);
        apt2.setProcedure("CBCT 3D Evaluation & Implant Site Staging (#46)");
        apt2.setStatus(AppointmentStatus.SCHEDULED);
        apt2.setNotes("Review bone density and fixture torque specs.");
        appointmentRepository.save(apt2);

        // 4. Invoices
        Invoice inv1 = new Invoice();
        inv1.setId("inv-01");
        inv1.setInvoiceNumber("INV-2026-042");
        inv1.setPatientId(savedP1.getId());
        inv1.setPatientName(savedP1.getName());
        inv1.setPatientPhone(savedP1.getPhone());
        inv1.setDate(LocalDate.now().minusDays(3));
        inv1.setDueDate(LocalDate.now().plusDays(10));
        inv1.setSubtotal(new BigDecimal("4500.00"));
        inv1.setDiscount(new BigDecimal("500.00"));
        inv1.setTax(new BigDecimal("200.00"));
        inv1.setGrandTotal(new BigDecimal("4200.00"));
        inv1.setAmountPaid(new BigDecimal("3000.00"));
        inv1.setBalanceDue(new BigDecimal("1200.00"));
        inv1.setStatus(PaymentStatus.PARTIAL);
        inv1.setPaymentMethod("UPI");
        inv1.setPaymentNotes("Initial token paid via Google Pay / UPI.");

        InvoiceItem item1 = new InvoiceItem("item-1", "Direct Composite Restoration (Tooth #16)", "CDT-D2391", 1, new BigDecimal("2500.00"), new BigDecimal("2500.00"));
        InvoiceItem item2 = new InvoiceItem("item-2", "Full Mouth Ultrasonic Scaling & Polishing", "CDT-D1110", 1, new BigDecimal("2000.00"), new BigDecimal("2000.00"));
        inv1.addItem(item1);
        inv1.addItem(item2);
        invoiceRepository.save(inv1);

        // 5. Prescriptions
        Prescription rx = new Prescription();
        rx.setId("rx-01");
        rx.setPrescriptionNumber("RX-2026-055");
        rx.setPatientId(savedP1.getId());
        rx.setPatientName(savedP1.getName());
        rx.setPatientAge(savedP1.getAge());
        rx.setPatientGender(savedP1.getGender());
        rx.setDate(LocalDate.now().minusDays(3));
        rx.setDoctorName("Dr. Smita Bevle");
        rx.setDoctorDegree("BDS, MDS (Prosthodontics & Implantology)");
        rx.setDoctorRegNo("MH-DENT-48921");
        rx.setDiagnosis("Deep Dental Caries (Tooth #16) with Reversible Pulpitis");
        rx.setBp("118/76 mmHg");
        rx.setPulse("72 bpm");
        rx.setGeneralAdvice("Avoid chewing hard foods on the upper right quadrant for 48 hours. Use warm salt water rinses.");
        rx.setNextFollowUp(LocalDate.now().plusDays(7));
        rx.setToothNumbers(List.of(16));

        PrescriptionMedicine med1 = new PrescriptionMedicine("med-1", "Tab. Ketorolac Tromethamine", "10mg", "1 Tab", "1-0-1 (Twice daily)", "3 Days", "After Food", "Take after meals if throbbing pain persists.");
        PrescriptionMedicine med2 = new PrescriptionMedicine("med-2", "Cap. Amoxicillin + Clavulanic Acid", "625mg", "1 Cap", "1-0-1 (Twice daily)", "5 Days", "After Food", "Complete full antibiotic course.");
        rx.addMedicine(med1);
        rx.addMedicine(med2);
        prescriptionRepository.save(rx);

        // 6. Notifications
        Notification notif1 = new Notification(
                "notif-1",
                "SMS",
                savedP1.getName(),
                savedP1.getPhone(),
                "Appointment Confirmed: APT-2026-081",
                "Your appointment with Dr. Smita Bevle is confirmed for today at 10:30 AM (Operatory Chair 1).",
                savedP1.getId(),
                "BOTH"
        );
        notificationRepository.save(notif1);

        System.out.println(">>> Initial Clinic Data Seeded Successfully!");
    }
}
