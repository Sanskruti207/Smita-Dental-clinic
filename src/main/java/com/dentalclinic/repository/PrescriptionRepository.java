package com.dentalclinic.repository;

import com.dentalclinic.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Electronic Dental Prescriptions.
 */
@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    List<Prescription> findByPatientIdOrderByDateDesc(String patientId);
    void deleteByPatientId(String patientId);
    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);
}
