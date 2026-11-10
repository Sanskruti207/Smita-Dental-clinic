package com.dentalclinic.repository;

import com.dentalclinic.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Notification audit logs.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByTargetRoleInOrderByTimestampDesc(List<String> targetRoles);
    List<Notification> findByPatientIdOrderByTimestampDesc(String patientId);
    List<Notification> findAllByOrderByTimestampDesc();
    void deleteByPatientId(String patientId);
}
