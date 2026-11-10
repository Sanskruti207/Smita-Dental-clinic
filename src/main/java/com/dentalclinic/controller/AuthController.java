package com.dentalclinic.controller;

import com.dentalclinic.dto.AuthRequest;
import com.dentalclinic.dto.AuthResponse;
import com.dentalclinic.dto.PatientRegistrationDto;
import com.dentalclinic.model.UserRole;
import com.dentalclinic.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for User Authentication, Sign-in, and Patient Portal Registration.
 * Endpoints:
 * - POST /api/auth/login : Doctor / Patient Authentication (any role)
 * - POST /api/auth/login/patient : Patient Login page (rejects the doctor account)
 * - POST /api/auth/login/doctor : Doctor Login page (rejects patient accounts)
 * - POST /api/auth/register : New Patient Self-Registration
 * - GET  /api/auth/me : Current user from the JWT
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = userService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login/patient")
    public ResponseEntity<AuthResponse> loginPatient(@Valid @RequestBody AuthRequest request) {
        return toResponse(userService.login(request, UserRole.PATIENT));
    }

    @PostMapping("/login/doctor")
    public ResponseEntity<AuthResponse> loginDoctor(@Valid @RequestBody AuthRequest request) {
        return toResponse(userService.login(request, UserRole.DOCTOR));
    }

    private ResponseEntity<AuthResponse> toResponse(AuthResponse response) {
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    /** Returns the user behind the current token (used by the frontend to restore a session). */
    @GetMapping("/me")
    public ResponseEntity<?> me(@org.springframework.security.core.annotation.AuthenticationPrincipal com.dentalclinic.security.AuthUser principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return userService.findById(principal.userId())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody PatientRegistrationDto dto) {
        AuthResponse response = userService.registerPatient(dto);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
