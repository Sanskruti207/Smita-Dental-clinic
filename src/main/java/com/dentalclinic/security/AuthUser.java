package com.dentalclinic.security;

import com.dentalclinic.model.UserRole;

/** Authenticated principal stored in the SecurityContext for every request carrying a valid JWT. */
public record AuthUser(String userId, String email, UserRole role, String patientId) {

    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public UserRole getRole() { return role; }
    public String getPatientId() { return patientId; }
}
