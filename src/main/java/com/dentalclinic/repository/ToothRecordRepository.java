package com.dentalclinic.repository;

import com.dentalclinic.model.ToothRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Patient Odontogram tooth records.
 */
@Repository
public interface ToothRecordRepository extends JpaRepository<ToothRecord, String> {
    List<ToothRecord> findByPatientIdOrderByToothNumberAsc(String patientId);
    Optional<ToothRecord> findByPatientIdAndToothNumber(String patientId, Integer toothNumber);
    void deleteByPatientId(String patientId);
}
