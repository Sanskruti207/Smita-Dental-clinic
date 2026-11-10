package com.dentalclinic.controller;

import com.dentalclinic.model.ClinicalNote;
import com.dentalclinic.model.Prescription;
import com.dentalclinic.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Electronic Dental Prescriptions (Rx) and Doctor Clinical Notes.
 * Endpoints:
 * - GET /api/prescriptions/patient/{patientId} : Patient prescription archive
 * - POST /api/prescriptions : Issue digital Rx with medicine dosage instructions
 * - GET /api/prescriptions/notes/patient/{patientId} : Doctor operatory notes
 * - POST /api/prescriptions/notes : Add clinical sitting examination note
 */
@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("@access.canAccessPatient(#patientId)")
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsForPatient(patientId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@access.canAccessPrescription(#id)")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable String id) {
        return prescriptionService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Prescription> createPrescription(@Valid @RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.createPrescription(prescription));
    }

    @GetMapping("/notes/patient/{patientId}")
    @PreAuthorize("@access.canAccessPatient(#patientId)")
    public ResponseEntity<List<ClinicalNote>> getPatientClinicalNotes(@PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.getClinicalNotesForPatient(patientId));
    }

    @PostMapping("/notes")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ClinicalNote> addClinicalNote(@Valid @RequestBody ClinicalNote note) {
        return ResponseEntity.ok(prescriptionService.addClinicalNote(note));
    }

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> deletePrescription(@PathVariable String id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}
