package com.dentalclinic.service.impl;

import com.dentalclinic.dto.AppointmentBookingRequest;
import com.dentalclinic.dto.AppointmentSlotDto;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.AppointmentStatus;
import com.dentalclinic.model.Patient;
import com.dentalclinic.repository.AppointmentRepository;
import com.dentalclinic.repository.PatientRepository;
import com.dentalclinic.service.AppointmentService;
import com.dentalclinic.service.NotificationService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

/**
 * Service implementation for Multi-Chair Dental Appointments and Real-Time Schedule Slot Calculation.
 */
@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final NotificationService notificationService;

    // Standard Clinic Operatory Timing Slots (09:00 AM - 06:00 PM)
    private static final List<String> STANDARD_TIME_SLOTS = List.of(
            "09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM",
            "02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM", "05:00 PM", "05:45 PM"
    );

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  PatientRepository patientRepository,
                                  NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.notificationService = notificationService;
    }

    @Override
    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByDateOrderByTimeAsc(date);
    }

    @Override
    public List<Appointment> getAppointmentsForPatient(String patientId) {
        return appointmentRepository.findByPatientIdOrderByDateDesc(patientId);
    }

    /**
     * Calculates occupied vs open slots for all 3 chairs on a specific date.
     * Enables patients to view the doctor's real-time schedule and pick open slots without conflict.
     */
    @Override
    public List<AppointmentSlotDto> getDoctorScheduleSlots(LocalDate date) {
        List<Appointment> existingAppts = appointmentRepository.findByDateAndStatusNot(date, AppointmentStatus.CANCELLED);

        // Map key: "chair-time" -> Appointment
        Map<String, Appointment> bookedMap = new HashMap<>();
        for (Appointment apt : existingAppts) {
            String key = apt.getChair() + "-" + apt.getTime();
            bookedMap.put(key, apt);
        }

        List<AppointmentSlotDto> result = new ArrayList<>();
        // For each of the 3 dental chairs
        for (int chair = 1; chair <= 3; chair++) {
            for (String time : STANDARD_TIME_SLOTS) {
                String key = chair + "-" + time;
                if (bookedMap.containsKey(key)) {
                    Appointment apt = bookedMap.get(key);
                    result.add(new AppointmentSlotDto(
                            date,
                            time,
                            chair,
                            true,
                            "Occupied: " + apt.getProcedure() + " (" + apt.getStatus() + ")",
                            apt.getProcedure(),
                            apt.getId()
                    ));
                } else {
                    result.add(new AppointmentSlotDto(
                            date,
                            time,
                            chair,
                            false,
                            "Available",
                            null,
                            null
                    ));
                }
            }
        }
        return result;
    }

    @Override
    public Appointment bookAppointment(AppointmentBookingRequest request) {
        // 1. Conflict Check: Verify chair and time slot is not already booked
        List<Appointment> existing = appointmentRepository.findByChairAndDate(request.getChair(), request.getDate());
        boolean hasConflict = existing.stream()
                .anyMatch(a -> a.getTime().equalsIgnoreCase(request.getTime()) && a.getStatus() != AppointmentStatus.CANCELLED);

        if (hasConflict) {
            throw new IllegalStateException("Chair " + request.getChair() + " is already occupied at " + request.getTime() + ". Please select another time or chair.");
        }

        // 2. Fetch Patient Details
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + request.getPatientId()));

        // 3. Generate Sequential Appointment Code
        // Next number = highest existing number + 1 (count()+N would repeat a number after any delete)
        String prefix = "APT-" + LocalDate.now().getYear() + "-";
        int next = Math.max(appointmentRepository.findMaxSequence(prefix), 80) + 1;
        String aptCode = prefix + String.format("%03d", next);

        Appointment appointment = new Appointment();
        appointment.setId("apt-" + UUID.randomUUID().toString().substring(0, 8));
        appointment.setAppointmentNumber(aptCode);
        appointment.setPatientId(patient.getId());
        appointment.setPatientName(patient.getName());
        appointment.setPatientPhone(patient.getPhone());
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setDurationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 30);
        appointment.setDoctor("Dr. Smita Bevle");
        appointment.setChair(request.getChair());
        appointment.setProcedure(request.getProcedure());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setNotes(request.getNotes());

        Appointment saved;
        try {
            // saveAndFlush so the UNIQUE(active_slot_key) check runs now, not at commit
            saved = appointmentRepository.saveAndFlush(appointment);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Chair " + request.getChair() + " was just booked at " + request.getTime() + ". Please select another time or chair.");
        }

        // 4. Send Confirmation Notification (SMS & Doctor operatory alert)
        notificationService.sendNotification(
                "SMS",
                patient.getName(),
                patient.getPhone(),
                "Appointment Confirmed: " + saved.getAppointmentNumber(),
                "Your appointment with Dr. Smita Bevle is scheduled for " + saved.getDate() + " at " + saved.getTime() + " (Chair " + saved.getChair() + ").",
                patient.getId(),
                "BOTH"
        );

        return saved;
    }

    @Override
    public Appointment updateAppointmentStatus(String id, AppointmentStatus status, String notes) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + id));
        apt.setStatus(status);
        if (notes != null && !notes.trim().isEmpty()) {
            apt.setNotes(notes);
        }
        return appointmentRepository.save(apt);
    }

    @Override
    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public void cancelAppointment(String id, String reason) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + id));
        apt.setStatus(AppointmentStatus.CANCELLED);
        apt.setCancellationReason(reason);
        appointmentRepository.save(apt);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllByOrderByDateDescTimeAsc();
    }

    @Override
    public Appointment rescheduleAppointment(String id, LocalDate newDate, String newTime, String notes) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + id));
        boolean conflict = appointmentRepository.findByChairAndDate(apt.getChair(), newDate).stream()
                .anyMatch(a -> !a.getId().equals(id) && a.getTime().equalsIgnoreCase(newTime) && a.getStatus() != AppointmentStatus.CANCELLED);
        if (conflict) {
            throw new IllegalStateException("Chair " + apt.getChair() + " is already occupied at " + newTime + " on " + newDate + ".");
        }
        apt.setDate(newDate);
        apt.setTime(newTime);
        apt.setStatus(AppointmentStatus.RESCHEDULED);
        if (notes != null && !notes.trim().isEmpty()) {
            apt.setNotes(notes);
        }
        try {
            return appointmentRepository.saveAndFlush(apt);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("That slot was just booked by someone else. Please choose another time.");
        }
    }

    @Override
    public void deleteAppointment(String id) {
        if (!appointmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Appointment not found: " + id);
        }
        appointmentRepository.deleteById(id);
    }
}
