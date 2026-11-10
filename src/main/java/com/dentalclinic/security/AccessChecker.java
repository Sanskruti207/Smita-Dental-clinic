package com.dentalclinic.security;

import com.dentalclinic.model.UserRole;
import com.dentalclinic.repository.AppointmentRepository;
import com.dentalclinic.repository.InvoiceRepository;
import com.dentalclinic.repository.PrescriptionRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Ownership rules used from @PreAuthorize("@access....").
 * A patient may only touch records that belong to their own patient profile; the doctor may touch everything.
 */
@Component("access")
public class AccessChecker {

    private final AppointmentRepository appointments;
    private final InvoiceRepository invoices;
    private final PrescriptionRepository prescriptions;

    public AccessChecker(AppointmentRepository appointments, InvoiceRepository invoices, PrescriptionRepository prescriptions) {
        this.appointments = appointments;
        this.invoices = invoices;
        this.prescriptions = prescriptions;
    }

    private AuthUser current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getPrincipal() instanceof AuthUser u) ? u : null;
    }

    public boolean isDoctor() {
        AuthUser u = current();
        return u != null && u.role() == UserRole.DOCTOR;
    }

    /** True for the doctor, or for a patient whose own profile id equals {@code patientId}. */
    public boolean canAccessPatient(String patientId) {
        AuthUser u = current();
        if (u == null) return false;
        return u.role() == UserRole.DOCTOR || (patientId != null && patientId.equals(u.patientId()));
    }

    public boolean canAccessAppointment(String appointmentId) {
        return appointments.findById(appointmentId).map(a -> canAccessPatient(a.getPatientId())).orElse(false);
    }

    public boolean canAccessInvoice(String invoiceId) {
        return invoices.findById(invoiceId).map(i -> canAccessPatient(i.getPatientId())).orElse(false);
    }

    public boolean canAccessPrescription(String prescriptionId) {
        return prescriptions.findById(prescriptionId).map(p -> canAccessPatient(p.getPatientId())).orElse(false);
    }
}
