package com.dentalclinic;

import com.dentalclinic.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthAndSecurityTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired UserRepository userRepository;

    private static final String DOCTOR = "dr.smita@dentalclinic.com";
    private static final String PATIENT = "sanskrutiab88@gmail.com";

    private MvcResult login(String path, String email, String password, int expectedStatus) throws Exception {
        return mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().is(expectedStatus)).andReturn();
    }

    private JsonNode loginOk(String path, String email, String password) throws Exception {
        return json.readTree(login(path, email, password, 200).getResponse().getContentAsString());
    }

    @Test
    void seededPasswordsAreStoredAsBcryptHashes() {
        String stored = userRepository.findByEmail(DOCTOR).orElseThrow().getPassword();
        assertTrue(stored.startsWith("$2"), "password must be a BCrypt hash, was: " + stored);
        assertNotEquals("doctor123", stored);
    }

    @Test
    void doctorLoginReturnsRealSignedJwt() throws Exception {
        JsonNode res = loginOk("/api/auth/login/doctor", DOCTOR, "doctor123");
        String token = res.get("token").asText();
        assertEquals(3, token.split("\\.").length, "JWT must have header.payload.signature");
        assertFalse(token.startsWith("JWT_"));
        assertFalse(res.get("user").has("password"), "password must never be returned");
    }

    @Test
    void wrongPasswordIsRejected() throws Exception {
        login("/api/auth/login/doctor", DOCTOR, "wrong-password", 400);
    }

    @Test
    void patientCannotUseDoctorLoginAndViceVersa() throws Exception {
        login("/api/auth/login/doctor", PATIENT, "patient123", 400);
        login("/api/auth/login/patient", DOCTOR, "doctor123", 400);
    }

    @Test
    void apiRejectsRequestsWithoutAToken() throws Exception {
        mvc.perform(get("/api/patients")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/patients").header("Authorization", "Bearer not.a.token")).andExpect(status().isUnauthorized());
    }

    @Test
    void patientCannotListAllPatientsButDoctorCan() throws Exception {
        String patientToken = loginOk("/api/auth/login/patient", PATIENT, "patient123").get("token").asText();
        String doctorToken = loginOk("/api/auth/login/doctor", DOCTOR, "doctor123").get("token").asText();
        mvc.perform(get("/api/patients").header("Authorization", "Bearer " + patientToken)).andExpect(status().isForbidden());
        mvc.perform(get("/api/patients").header("Authorization", "Bearer " + doctorToken)).andExpect(status().isOk());
        mvc.perform(get("/api/billing/invoices").header("Authorization", "Bearer " + patientToken)).andExpect(status().isForbidden());
    }

    @Test
    void patientCanOnlyReadTheirOwnRecords() throws Exception {
        JsonNode login = loginOk("/api/auth/login/patient", PATIENT, "patient123");
        String token = login.get("token").asText();
        String ownPatientId = login.get("user").get("patientId").asText();

        mvc.perform(get("/api/appointments/patient/" + ownPatientId).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        mvc.perform(get("/api/appointments/patient/someone-elses-id").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        mvc.perform(get("/api/billing/patient/someone-elses-id").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void registrationRejectsShortPasswordsAndHashesGoodOnes() throws Exception {
        String body = "{\"name\":\"Test Person\",\"age\":30,\"gender\":\"Male\",\"phone\":\"+91 90000 00000\","
                + "\"email\":\"test.person@example.com\",\"password\":\"%s\"}";
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body.formatted("short")))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body.formatted("longenough1")))
                .andExpect(status().isOk());
        String stored = userRepository.findByEmail("test.person@example.com").orElseThrow().getPassword();
        assertTrue(stored.startsWith("$2"));
    }
}
