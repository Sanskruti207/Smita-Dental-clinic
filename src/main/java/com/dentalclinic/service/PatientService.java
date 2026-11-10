package com.dentalclinic.service;

import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.dto.ToothUpdateDto;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.ToothRecord;

import java.util.List;
import java.util.Optional;

public interface PatientService {
    List<Patient> getAllPatients();
    Optional<Patient> getPatientById(String id);
    Optional<Patient> getPatientByCode(String code);
    List<Patient> searchPatients(String query);
    Patient createPatient(PatientRegistrationDto dto);
    Patient updatePatient(String id, Patient patient);
    List<ToothRecord> getPatientDentalChart(String patientId);
    ToothRecord updateToothCondition(String patientId, ToothUpdateDto dto);
    void deletePatient(String id);
}
