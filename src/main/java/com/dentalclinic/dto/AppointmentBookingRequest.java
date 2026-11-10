package com.dentalclinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * DTO for booking a dental chair appointment.
 */
public class AppointmentBookingRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Time slot is required (e.g. 10:30 AM)")
    private String time;

    @NotNull(message = "Chair number (1, 2, or 3) is required")
    private Integer chair;

    @NotBlank(message = "Procedure is required")
    private String procedure;

    private Integer durationMinutes = 30;
    private String notes;

    public AppointmentBookingRequest() {
    }

    // Getters and Setters
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Integer getChair() { return chair; }
    public void setChair(Integer chair) { this.chair = chair; }

    public String getProcedure() { return procedure; }
    public void setProcedure(String procedure) { this.procedure = procedure; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
