package com.dentalclinic.service;

import com.dentalclinic.dto.AuthRequest;
import com.dentalclinic.dto.AuthResponse;
import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.model.User;
import com.dentalclinic.model.UserRole;

import java.util.Optional;

public interface UserService {
    AuthResponse login(AuthRequest request);
    /** Login that only succeeds when the account has the given role (separate Patient / Doctor login pages). */
    AuthResponse login(AuthRequest request, UserRole expectedRole);
    AuthResponse registerPatient(PatientRegistrationDto dto);
    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);
}
