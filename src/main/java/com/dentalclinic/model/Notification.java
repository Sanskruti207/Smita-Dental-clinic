package com.dentalclinic.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity logging system SMS and Email alerts sent to Patients and Doctors.
 */
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 20)
    private String type; // "SMS" or "EMAIL"

    @Column(name = "recipient_name", nullable = false, length = 150)
    private String recipientName;

    @Column(name = "recipient_contact", nullable = false, length = 100)
    private String recipientContact;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String status = "DELIVERED";

    @Column(name = "patient_id", length = 36)
    private String patientId;

    @Column(name = "target_role", nullable = false, length = 20)
    private String targetRole; // "DOCTOR", "PATIENT", or "BOTH"

    public Notification() {
    }

    public Notification(String id, String type, String recipientName, String recipientContact, String title, String message, String patientId, String targetRole) {
        this.id = id;
        this.type = type;
        this.recipientName = recipientName;
        this.recipientContact = recipientContact;
        this.title = title;
        this.message = message;
        this.patientId = patientId;
        this.targetRole = targetRole;
        this.timestamp = LocalDateTime.now();
        this.status = "DELIVERED";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientContact() { return recipientContact; }
    public void setRecipientContact(String recipientContact) { this.recipientContact = recipientContact; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
}
