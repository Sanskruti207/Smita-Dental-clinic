package com.dentalclinic.service;

import com.dentalclinic.dto.AppointmentBookingRequest;
import com.dentalclinic.dto.AppointmentSlotDto;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    List<Appointment> getAppointmentsByDate(LocalDate date);
    List<Appointment> getAppointmentsForPatient(String patientId);
    List<AppointmentSlotDto> getDoctorScheduleSlots(LocalDate date);
    Appointment bookAppointment(AppointmentBookingRequest request);
    Appointment updateAppointmentStatus(String id, AppointmentStatus status, String notes);
    Optional<Appointment> getAppointmentById(String id);
    void cancelAppointment(String id, String reason);
    List<Appointment> getAllAppointments();
    Appointment rescheduleAppointment(String id, LocalDate newDate, String newTime, String notes);
    void deleteAppointment(String id);
}
