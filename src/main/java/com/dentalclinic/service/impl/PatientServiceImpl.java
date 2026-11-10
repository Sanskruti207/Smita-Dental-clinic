package com.dentalclinic.service.impl;

import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.dto.ToothUpdateDto;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.ToothCondition;
import com.dentalclinic.model.ToothRecord;
import com.dentalclinic.repository.*;
import com.dentalclinic.service.PatientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service handling Patient demographics, search, and 32-tooth Odontogram chart.
 */
@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final ToothRecordRepository toothRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public PatientServiceImpl(PatientRepository patientRepository, ToothRecordRepository toothRecordRepository,
                              AppointmentRepository appointmentRepository, InvoiceRepository invoiceRepository,
                              PrescriptionRepository prescriptionRepository, ClinicalNoteRepository clinicalNoteRepository,
                              NotificationRepository notificationRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.invoiceRepository = invoiceRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.clinicalNoteRepository = clinicalNoteRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.toothRecordRepository = toothRecordRepository;
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    @Override
    public Optional<Patient> getPatientByCode(String code) {
        return patientRepository.findByPatientIdCode(code);
    }

    @Override
    public List<Patient> searchPatients(String query) {
        if (query == null || query.trim().isEmpty()) {
            return patientRepository.findAll();
        }
        return patientRepository.searchPatients(query.trim());
    }

    @Override
    public Patient createPatient(PatientRegistrationDto dto) {
        String patientId = "pat-" + UUID.randomUUID().toString().substring(0, 8);
        long count = patientRepository.count() + 101;
        String code = "SDC-2026-" + count;

        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setPatientIdCode(code);
        patient.setName(dto.getName());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setEmergencyContactName(dto.getEmergencyContactName());
        patient.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        patient.setEmergencyContactRelation(dto.getEmergencyContactRelation());
        patient.setMedicalAlerts(dto.getMedicalAlerts() != null ? dto.getMedicalAlerts() : List.of());
        patient.setChiefComplaint(dto.getChiefComplaint());
        patient.setPreviousDentalHistory(dto.getPreviousDentalHistory());
        patient.setRegistrationDate(LocalDate.now());

        Patient saved = patientRepository.save(patient);

        // Initialize 32 healthy teeth for patient Odontogram (FDI / Universal adult notation)
        for (int tooth = 1; tooth <= 32; tooth++) {
            ToothRecord tr = new ToothRecord(
                    "tr-" + UUID.randomUUID().toString().substring(0, 8),
                    saved.getId(),
                    tooth,
                    ToothCondition.HEALTHY,
                    null
            );
            toothRecordRepository.save(tr);
        }

        return saved;
    }

    @Override
    public Patient updatePatient(String id, Patient incoming) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + id));
        // Copy only the editable profile fields (null = "not sent, keep current").
        // Identity (id, patient code) and money totals can never be overwritten from the outside.
        if (incoming.getName() != null) existing.setName(incoming.getName());
        if (incoming.getAge() != null) existing.setAge(incoming.getAge());
        if (incoming.getGender() != null) existing.setGender(incoming.getGender());
        if (incoming.getPhone() != null) existing.setPhone(incoming.getPhone());
        if (incoming.getEmail() != null) existing.setEmail(incoming.getEmail());
        if (incoming.getAddress() != null) existing.setAddress(incoming.getAddress());
        if (incoming.getBloodGroup() != null) existing.setBloodGroup(incoming.getBloodGroup());
        if (incoming.getEmergencyContactName() != null) existing.setEmergencyContactName(incoming.getEmergencyContactName());
        if (incoming.getEmergencyContactPhone() != null) existing.setEmergencyContactPhone(incoming.getEmergencyContactPhone());
        if (incoming.getEmergencyContactRelation() != null) existing.setEmergencyContactRelation(incoming.getEmergencyContactRelation());
        if (incoming.getMedicalAlerts() != null) existing.setMedicalAlerts(incoming.getMedicalAlerts());
        if (incoming.getChiefComplaint() != null) existing.setChiefComplaint(incoming.getChiefComplaint());
        if (incoming.getPreviousDentalHistory() != null) existing.setPreviousDentalHistory(incoming.getPreviousDentalHistory());
        if (incoming.getLastVisitDate() != null) existing.setLastVisitDate(incoming.getLastVisitDate());
        // used once by registration to link the login account to the profile
        if (existing.getUserId() == null && incoming.getUserId() != null) existing.setUserId(incoming.getUserId());
        return patientRepository.save(existing);
    }

    @Override
    public void deletePatient(String id) {
        if (!patientRepository.existsById(id)) {
            throw new IllegalArgumentException("Patient not found: " + id);
        }
        appointmentRepository.deleteByPatientId(id);
        invoiceRepository.deleteByPatientId(id);
        prescriptionRepository.deleteByPatientId(id);
        clinicalNoteRepository.deleteByPatientId(id);
        toothRecordRepository.deleteByPatientId(id);
        notificationRepository.deleteByPatientId(id);
        userRepository.deleteByPatientId(id);
        patientRepository.deleteById(id);
    }

    @Override
    public List<ToothRecord> getPatientDentalChart(String patientId) {
        return toothRecordRepository.findByPatientIdOrderByToothNumberAsc(patientId);
    }

    @Override
    public ToothRecord updateToothCondition(String patientId, ToothUpdateDto dto) {
        Optional<ToothRecord> existing = toothRecordRepository.findByPatientIdAndToothNumber(patientId, dto.getToothNumber());
        ToothRecord record;
        if (existing.isPresent()) {
            record = existing.get();
            record.setCondition(dto.getCondition());
            record.setNotes(dto.getNotes());
        } else {
            record = new ToothRecord(
                    "tr-" + UUID.randomUUID().toString().substring(0, 8),
                    patientId,
                    dto.getToothNumber(),
                    dto.getCondition(),
                    dto.getNotes()
            );
        }
        return toothRecordRepository.save(record);
    }
}
