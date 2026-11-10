package com.dentalclinic.service;

import com.dentalclinic.model.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForRole(String role);
    List<Notification> getNotificationsForPatient(String patientId);
    Notification sendNotification(String type, String recipientName, String recipientContact, String title, String message, String patientId, String targetRole);
}
