package com.dentalclinic.dto;

import java.time.LocalDate;

/**
 * DTO representing an operatory slot status for Patient Self-Scheduling.
 * Allows patients to see doctor's occupied schedule and select open slots.
 */
public class AppointmentSlotDto {

    private LocalDate date;
    private String timeSlot; // e.g. "10:30 AM"
    private Integer chair; // Chair 1, Chair 2, Chair 3
    private boolean occupied;
    private String occupiedReason; // e.g. "Occupied (Dr. Smita Bevle - Root Canal)" or "Booked"
    private String procedure;
    private String appointmentId;

    public AppointmentSlotDto() {
    }

    public AppointmentSlotDto(LocalDate date, String timeSlot, Integer chair, boolean occupied, String occupiedReason, String procedure, String appointmentId) {
        this.date = date;
        this.timeSlot = timeSlot;
        this.chair = chair;
        this.occupied = occupied;
        this.occupiedReason = occupiedReason;
        this.procedure = procedure;
        this.appointmentId = appointmentId;
    }

    // Getters and Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public Integer getChair() { return chair; }
    public void setChair(Integer chair) { this.chair = chair; }

    public boolean isOccupied() { return occupied; }
    public void setOccupied(boolean occupied) { this.occupied = occupied; }

    public String getOccupiedReason() { return occupiedReason; }
    public void setOccupiedReason(String occupiedReason) { this.occupiedReason = occupiedReason; }

    public String getProcedure() { return procedure; }
    public void setProcedure(String procedure) { this.procedure = procedure; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }
}
