package com.dentalclinic.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity tracking the condition of each tooth (1-32) for a patient's Odontogram.
 */
@Entity
@Table(name = "tooth_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"patient_id", "tooth_number"})
})
public class ToothRecord {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "patient_id", nullable = false, length = 36)
    private String patientId;

    @Column(name = "tooth_number", nullable = false)
    private Integer toothNumber; // 1 to 32

    @Enumerated(EnumType.STRING)
    @Column(name = "tooth_condition", nullable = false, length = 30)
    private ToothCondition condition = ToothCondition.HEALTHY;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ToothRecord() {
    }

    public ToothRecord(String id, String patientId, Integer toothNumber, ToothCondition condition, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.toothNumber = toothNumber;
        this.condition = condition;
        this.notes = notes;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public Integer getToothNumber() { return toothNumber; }
    public void setToothNumber(Integer toothNumber) { this.toothNumber = toothNumber; }

    public ToothCondition getCondition() { return condition; }
    public void setCondition(ToothCondition condition) { this.condition = condition; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
