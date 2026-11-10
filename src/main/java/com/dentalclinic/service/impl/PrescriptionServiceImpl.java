package com.dentalclinic.service.impl;

import com.dentalclinic.model.ClinicalNote;
import com.dentalclinic.model.Prescription;
import com.dentalclinic.model.PrescriptionMedicine;
import com.dentalclinic.repository.ClinicalNoteRepository;
import com.dentalclinic.repository.PrescriptionRepository;
import com.dentalclinic.service.NotificationService;
import com.dentalclinic.service.PrescriptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service implementation for Electronic Dental Prescriptions and Clinical Operatory Notes.
 */
@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final NotificationService notificationService;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository,
                                   ClinicalNoteRepository clinicalNoteRepository,
                                   NotificationService notificationService) {
        this.prescriptionRepository = prescriptionRepository;
        this.clinicalNoteRepository = clinicalNoteRepository;
        this.notificationService = notificationService;
    }

    @Override
    public List<Prescription> getPrescriptionsForPatient(String patientId) {
        return prescriptionRepository.findByPatientIdOrderByDateDesc(patientId);
    }

    @Override
    public Optional<Prescription> getPrescriptionById(String id) {
        return prescriptionRepository.findById(id);
    }

    @Override
    public Prescription createPrescription(Prescription prescription) {
        if (prescription.getId() == null || prescription.getId().trim().isEmpty()) {
            prescription.setId("rx-" + UUID.randomUUID().toString().substring(0, 8));
        }

        long count = prescriptionRepository.count() + 55;
        prescription.setPrescriptionNumber("RX-2026-" + String.format("%03d", count));
        if (prescription.getDate() == null) {
            prescription.setDate(LocalDate.now());
        }

        // Link medicines
        if (prescription.getMedicines() != null) {
            for (PrescriptionMedicine med : prescription.getMedicines()) {
                if (med.getId() == null) {
                    med.setId("med-" + UUID.randomUUID().toString().substring(0, 8));
                }
                med.setPrescription(prescription);
            }
        }

        Prescription saved = prescriptionRepository.save(prescription);

        // Alert patient that Rx is ready for download
        notificationService.sendNotification(
                "SMS",
                saved.getPatientName(),
                "Patient Direct",
                "Digital Prescription Ready: " + saved.getPrescriptionNumber(),
                "Dr. Smita Bevle has issued your digital prescription for " + saved.getDiagnosis() + ". Download from your patient portal.",
                saved.getPatientId(),
                "PATIENT"
        );

        return saved;
    }

    @Override
    public List<ClinicalNote> getClinicalNotesForPatient(String patientId) {
        return clinicalNoteRepository.findByPatientIdOrderByDateDesc(patientId);
    }

    @Override
    public ClinicalNote addClinicalNote(ClinicalNote note) {
        if (note.getId() == null) {
            note.setId("note-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (note.getDate() == null) {
            note.setDate(LocalDate.now());
        }
        return clinicalNoteRepository.save(note);
    }

    @Override
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @Override
    public void deletePrescription(String id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new IllegalArgumentException("Prescription not found: " + id);
        }
        prescriptionRepository.deleteById(id);
    }
}
