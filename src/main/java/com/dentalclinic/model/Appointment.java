package com.dentalclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing scheduled and active operatory dental appointments.
 * Supports multi-chair management (Chair 1, Chair 2, Chair 3).
 */
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "appointment_number", unique = true, nullable = false, length = 30)
    private String appointmentNumber; // e.g. "APT-2026-081"

    @Column(name = "patient_id", nullable = false, length = 36)
    private String patientId;

    @Column(name = "patient_name", nullable = false, length = 150)
    private String patientName;

    @Column(name = "patient_phone", nullable = false, length = 30)
    private String patientPhone;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate date;

    @Column(name = "appointment_time", nullable = false, length = 20)
    private String time; // e.g. "10:30 AM"

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 30;

    @Column(name = "doctor_name", nullable = false, length = 150)
    private String doctor = "Dr. Smita Bevle";

    @Column(name = "chair_number", nullable = false)
    private Integer chair; // 1, 2, or 3

    @Column(name = "procedure_name", nullable = false, length = 150)
    private String procedure;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    /**
     * "chair|date|time" while the appointment is active, NULL once cancelled.
     * The UNIQUE constraint makes it impossible for two active appointments to share a chair + time,
     * even when two requests arrive at the same moment (NULLs do not collide, so cancelled slots can be re-booked).
     */
    @JsonIgnore
    @Column(name = "active_slot_key", unique = true, length = 60)
    private String activeSlotKey;

    @PrePersist
    @PreUpdate
    void syncActiveSlotKey() {
        if (status == AppointmentStatus.CANCELLED || chair == null || date == null || time == null) {
            activeSlotKey = null;
        } else {
            activeSlotKey = chair + "|" + date + "|" + time.trim().toUpperCase();
        }
    }

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Appointment() {
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppointmentNumber() { return appointmentNumber; }
    public void setAppointmentNumber(String appointmentNumber) { this.appointmentNumber = appointmentNumber; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getDoctor() { return doctor; }
    public void setDoctor(String doctor) { this.doctor = doctor; }

    public Integer getChair() { return chair; }
    public void setChair(Integer chair) { this.chair = chair; }

    public String getProcedure() { return procedure; }
    public void setProcedure(String procedure) { this.procedure = procedure; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
