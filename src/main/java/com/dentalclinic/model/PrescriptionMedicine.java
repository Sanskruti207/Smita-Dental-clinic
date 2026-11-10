package com.dentalclinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

/**
 * Line item in a prescription detailing dosage, frequency, and instructions.
 */
@Entity
@Table(name = "prescription_medicines")
public class PrescriptionMedicine {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @JsonIgnore
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false, length = 150)
    private String name;

    @Column(length = 50)
    private String strength;

    @Column(nullable = false, length = 50)
    private String dosage; // e.g. "1 Tab"

    @Column(nullable = false, length = 50)
    private String frequency; // e.g. "1-0-1 (Twice daily)"

    @Column(nullable = false, length = 50)
    private String duration; // e.g. "5 Days"

    @Column(nullable = false, length = 50)
    private String timing; // "Before Food" or "After Food"

    @Column(columnDefinition = "TEXT")
    private String instructions;

    public PrescriptionMedicine() {
    }

    public PrescriptionMedicine(String id, String name, String strength, String dosage, String frequency, String duration, String timing, String instructions) {
        this.id = id;
        this.name = name;
        this.strength = strength;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.timing = timing;
        this.instructions = instructions;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStrength() { return strength; }
    public void setStrength(String strength) { this.strength = strength; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getTiming() { return timing; }
    public void setTiming(String timing) { this.timing = timing; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
}
