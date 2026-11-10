package com.dentalclinic.repository;

import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA Repository for Appointments.
 * Provides query methods for Doctor schedule calendar, chair allocation, and patient booking.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByDateOrderByTimeAsc(LocalDate date);
    List<Appointment> findByPatientIdOrderByDateDesc(String patientId);
    List<Appointment> findByChairAndDate(Integer chair, LocalDate date);
    List<Appointment> findByDateAndStatusNot(LocalDate date, AppointmentStatus status);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findAllByOrderByDateDescTimeAsc();
    void deleteByPatientId(String patientId);

    /** Highest numeric suffix used so far for appointment numbers starting with the given prefix (0 if none). */
    @Query("select coalesce(max(cast(substring(a.appointmentNumber, 10) as integer)), 0) from Appointment a where a.appointmentNumber like concat(:prefix, '%')")
    int findMaxSequence(@Param("prefix") String prefix);
}
