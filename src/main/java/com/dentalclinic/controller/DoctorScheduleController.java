package com.dentalclinic.controller;

import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Notification;
import com.dentalclinic.service.AppointmentService;
import com.dentalclinic.service.NotificationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Doctor Operatory Dashboard, Chair status, and Clinic Notifications.
 * Endpoints:
 * - GET /api/doctor/chairs : Current chair status across operatory chairs 1, 2, and 3
 * - GET /api/doctor/notifications : Role-filtered notification alerts
 * - GET /api/doctor/overview : Summary statistics (daily appointments, chair occupancy)
 */
@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorScheduleController {

    private final AppointmentService appointmentService;
    private final NotificationService notificationService;

    public DoctorScheduleController(AppointmentService appointmentService, NotificationService notificationService) {
        this.appointmentService = appointmentService;
        this.notificationService = notificationService;
    }

    @GetMapping("/chairs")
    public ResponseEntity<Map<String, Object>> getChairStatus(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        List<Appointment> todayAppts = appointmentService.getAppointmentsByDate(queryDate);

        return ResponseEntity.ok(Map.of(
                "date", queryDate,
                "totalAppointments", todayAppts.size(),
                "appointments", todayAppts,
                "chairs", List.of(
                        Map.of("chairNumber", 1, "name", "Operatory Chair 1 (Surgery / Implants)"),
                        Map.of("chairNumber", 2, "name", "Operatory Chair 2 (Endo & Restorative)"),
                        Map.of("chairNumber", 3, "name", "Operatory Chair 3 (Orthodontics & Scaling)")
                )
        ));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getDoctorNotifications() {
        return ResponseEntity.ok(notificationService.getNotificationsForRole("DOCTOR"));
    }
}
