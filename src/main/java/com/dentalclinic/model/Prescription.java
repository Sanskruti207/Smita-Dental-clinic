package com.dentalclinic.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing Electronic Dental Prescriptions (Rx).
 * Contains patient vitals, diagnosis, doctor registration details, and medication list.
 */
@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "prescription_number", unique = true, nullable = false, length = 30)
    private String prescriptionNumber; // e.g. "RX-2026-055"

    @Column(name = "patient_id", nullable = false, length = 36)
    private String patientId;

    @Column(name = "patient_name", nullable = false, length = 150)
    private String patientName;

    @Column(name = "patient_age", nullable = false)
    private Integer patientAge;

    @Column(name = "patient_gender", nullable = false, length = 20)
    private String patientGender;

    @Column(name = "prescription_date", nullable = false)
    private LocalDate date;

    @Column(name = "doctor_name", nullable = false, length = 150)
    private String doctorName = "Dr. Smita Bevle";

    @Column(name = "doctor_degree", length = 100)
    private String doctorDegree = "BDS, MDS (Prosthodontics & Implantology)";

    @Column(name = "doctor_reg_no", length = 50)
    private String doctorRegNo = "MH-DENT-48921";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnosis;

    @Column(length = 20)
    private String bp;

    @Column(length = 20)
    private String pulse;

    @Column(length = 20)
    private String sugar;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<PrescriptionMedicine> medicines = new ArrayList<>();

    @Column(name = "general_advice", columnDefinition = "TEXT")
    private String generalAdvice;

    @Column(name = "next_follow_up")
    private LocalDate nextFollowUp;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "prescription_tooth_numbers", joinColumns = @JoinColumn(name = "prescription_id"))
    @Column(name = "tooth_number")
    private List<Integer> toothNumbers = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Prescription() {
    }

    public void addMedicine(PrescriptionMedicine med) {
        medicines.add(med);
        med.setPrescription(this);
    }

    public void removeMedicine(PrescriptionMedicine med) {
        medicines.remove(med);
        med.setPrescription(null);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Integer getPatientAge() { return patientAge; }
    public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorDegree() { return doctorDegree; }
    public void setDoctorDegree(String doctorDegree) { this.doctorDegree = doctorDegree; }

    public String getDoctorRegNo() { return doctorRegNo; }
    public void setDoctorRegNo(String doctorRegNo) { this.doctorRegNo = doctorRegNo; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getBp() { return bp; }
    public void setBp(String bp) { this.bp = bp; }

    public String getPulse() { return pulse; }
    public void setPulse(String pulse) { this.pulse = pulse; }

    public String getSugar() { return sugar; }
    public void setSugar(String sugar) { this.sugar = sugar; }

    public List<PrescriptionMedicine> getMedicines() { return medicines; }
    public void setMedicines(List<PrescriptionMedicine> medicines) { this.medicines = medicines; }

    public String getGeneralAdvice() { return generalAdvice; }
    public void setGeneralAdvice(String generalAdvice) { this.generalAdvice = generalAdvice; }

    public LocalDate getNextFollowUp() { return nextFollowUp; }
    public void setNextFollowUp(LocalDate nextFollowUp) { this.nextFollowUp = nextFollowUp; }

    public List<Integer> getToothNumbers() { return toothNumbers; }
    public void setToothNumbers(List<Integer> toothNumbers) { this.toothNumbers = toothNumbers; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
