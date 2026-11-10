package com.dentalclinic.service.impl;

import com.dentalclinic.dto.AuthRequest;
import com.dentalclinic.dto.AuthResponse;
import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.User;
import com.dentalclinic.model.UserRole;
import com.dentalclinic.repository.UserRepository;
import com.dentalclinic.service.NotificationService;
import com.dentalclinic.service.PatientService;
import com.dentalclinic.security.JwtService;
import com.dentalclinic.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Service implementation for User Authentication and Patient account linking.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PatientService patientService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final int MIN_PASSWORD_LENGTH = 8;

    public UserServiceImpl(UserRepository userRepository, PatientService patientService, NotificationService notificationService,
                           PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.patientService = patientService;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        return authenticate(request, null);
    }

    @Override
    public AuthResponse login(AuthRequest request, UserRole expectedRole) {
        return authenticate(request, expectedRole);
    }

    private AuthResponse authenticate(AuthRequest request, UserRole expectedRole) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, null, "No account found with this email address.", null);
        }

        User user = userOpt.get();
        if (!passwordMatches(user, request.getPassword())) {
            return new AuthResponse(false, null, "Invalid password credentials.", null);
        }

        // Separate logins: correct credentials but the wrong login page for this account type
        if (expectedRole != null && user.getRole() != expectedRole) {
            String message = (expectedRole == UserRole.DOCTOR)
                    ? "This is a patient account. Please use the Patient Login."
                    : "This is the doctor account. Please use the Doctor Login.";
            return new AuthResponse(false, null, message, null);
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(true, token, "Login successful as " + user.getRole(), user);
    }

    /**
     * BCrypt check. Accounts created before hashing existed still hold a plain-text password:
     * accept it once and immediately upgrade it to a BCrypt hash.
     */
    private boolean passwordMatches(User user, String rawPassword) {
        String stored = user.getPassword();
        if (stored == null || rawPassword == null) return false;
        if (stored.startsWith("$2")) {
            return passwordEncoder.matches(rawPassword, stored);
        }
        if (stored.equals(rawPassword)) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public AuthResponse registerPatient(PatientRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail().toLowerCase().trim())) {
            return new AuthResponse(false, null, "An account with this email already exists.", null);
        }

        if (dto.getPassword() == null || dto.getPassword().length() < MIN_PASSWORD_LENGTH) {
            return new AuthResponse(false, null, "Password must be at least " + MIN_PASSWORD_LENGTH + " characters long.", null);
        }

        // 1. Create Patient Clinical Profile
        Patient patient = patientService.createPatient(dto);

        // 2. Create User Credentials
        String userId = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                userId,
                dto.getName(),
                dto.getEmail().toLowerCase().trim(),
                dto.getPhone(),
                passwordEncoder.encode(dto.getPassword()),
                UserRole.PATIENT,
                patient.getId(),
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
        );
        userRepository.save(user);

        // Link User ID back to Patient
        patient.setUserId(userId);
        patientService.updatePatient(patient.getId(), patient);

        // Send Welcome SMS/Email alert
        notificationService.sendNotification(
                "SMS",
                patient.getName(),
                patient.getPhone(),
                "Welcome to Smita Dental Clinic",
                "Hello " + patient.getName() + ", your patient ID is " + patient.getPatientIdCode() + ". Book appointments 24/7 online.",
                patient.getId(),
                "PATIENT"
        );

        String token = jwtService.generateToken(user);
        return new AuthResponse(true, token, "Registration successful!", user);
    }

    @Override
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim());
    }
}
