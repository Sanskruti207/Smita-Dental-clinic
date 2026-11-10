package com.dentalclinic.service;

import com.dentalclinic.model.ClinicalNote;
import com.dentalclinic.model.Prescription;

import java.util.List;
import java.util.Optional;

public interface PrescriptionService {
    List<Prescription> getPrescriptionsForPatient(String patientId);
    Optional<Prescription> getPrescriptionById(String id);
    Prescription createPrescription(Prescription prescription);
    List<ClinicalNote> getClinicalNotesForPatient(String patientId);
    ClinicalNote addClinicalNote(ClinicalNote note);
    List<Prescription> getAllPrescriptions();
    void deletePrescription(String id);
}
