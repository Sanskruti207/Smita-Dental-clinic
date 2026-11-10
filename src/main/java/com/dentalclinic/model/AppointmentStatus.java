package com.dentalclinic.model;

/**
 * Lifecycle states of an appointment in the clinic operatory workflow.
 */
public enum AppointmentStatus {
    SCHEDULED,
    CHECKED_IN,
    IN_CHAIR,
    COMPLETED,
    RESCHEDULED,
    CANCELLED
}
