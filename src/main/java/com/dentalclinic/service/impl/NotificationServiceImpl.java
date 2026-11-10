package com.dentalclinic.service.impl;

import com.dentalclinic.model.Notification;
import com.dentalclinic.repository.NotificationRepository;
import com.dentalclinic.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service implementation for SMS and Email communication dispatching.
 */
@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public List<Notification> getNotificationsForRole(String role) {
        if ("DOCTOR".equalsIgnoreCase(role)) {
            return notificationRepository.findByTargetRoleInOrderByTimestampDesc(List.of("DOCTOR", "BOTH"));
        } else {
            return notificationRepository.findByTargetRoleInOrderByTimestampDesc(List.of("PATIENT", "BOTH"));
        }
    }

    @Override
    public List<Notification> getNotificationsForPatient(String patientId) {
        return notificationRepository.findByPatientIdOrderByTimestampDesc(patientId);
    }

    @Override
    public Notification sendNotification(String type, String recipientName, String recipientContact,
                                         String title, String message, String patientId, String targetRole) {
        Notification notification = new Notification(
                "notif-" + UUID.randomUUID().toString().substring(0, 8),
                type,
                recipientName,
                recipientContact,
                title,
                message,
                patientId,
                targetRole
        );
        return notificationRepository.save(notification);
    }
}
