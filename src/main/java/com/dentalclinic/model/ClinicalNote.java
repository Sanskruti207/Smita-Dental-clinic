package com.dentalclinic.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Operatory and clinical findings recorded by attending doctor per sitting.
 */
@Entity
@Table(name = "clinical_notes")
public class ClinicalNote {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "patient_id", nullable = false, length = 36)
    private String patientId;

    @Column(name = "note_date", nullable = false)
    private LocalDate date;

    @Column(name = "chief_complaint", nullable = false, columnDefinition = "TEXT")
    private String chiefComplaint;

    @Column(name = "clinical_examination", nullable = false, columnDefinition = "TEXT")
    private String clinicalExamination;

    @Column(name = "periodontal_status", length = 100)
    private String periodontalStatus;

    @Column(name = "radiographic_findings", columnDefinition = "TEXT")
    private String radiographicFindings;

    @Column(name = "proposed_treatment", nullable = false, columnDefinition = "TEXT")
    private String proposedTreatment;

    @Column(name = "chair_number")
    private Integer chairNumber;

    @Column(name = "attending_doctor", nullable = false, length = 150)
    private String attendingDoctor = "Dr. Smita Bevle";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ClinicalNote() {
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getClinicalExamination() { return clinicalExamination; }
    public void setClinicalExamination(String clinicalExamination) { this.clinicalExamination = clinicalExamination; }

    public String getPeriodontalStatus() { return periodontalStatus; }
    public void setPeriodontalStatus(String periodontalStatus) { this.periodontalStatus = periodontalStatus; }

    public String getRadiographicFindings() { return radiographicFindings; }
    public void setRadiographicFindings(String radiographicFindings) { this.radiographicFindings = radiographicFindings; }

    public String getProposedTreatment() { return proposedTreatment; }
    public void setProposedTreatment(String proposedTreatment) { this.proposedTreatment = proposedTreatment; }

    public Integer getChairNumber() { return chairNumber; }
    public void setChairNumber(Integer chairNumber) { this.chairNumber = chairNumber; }

    public String getAttendingDoctor() { return attendingDoctor; }
    public void setAttendingDoctor(String attendingDoctor) { this.attendingDoctor = attendingDoctor; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
