package com.dentalclinic.repository;

import com.dentalclinic.model.ClinicalNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Clinical Notes and Operatory History.
 */
@Repository
public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, String> {
    List<ClinicalNote> findByPatientIdOrderByDateDesc(String patientId);
    void deleteByPatientId(String patientId);
}
