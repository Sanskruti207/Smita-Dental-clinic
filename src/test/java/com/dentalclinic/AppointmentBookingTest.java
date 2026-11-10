package com.dentalclinic;

import com.dentalclinic.dto.AppointmentBookingRequest;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.repository.PatientRepository;
import com.dentalclinic.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AppointmentBookingTest {

    @Autowired AppointmentService appointments;
    @Autowired PatientRepository patients;

    private String patientId;
    private LocalDate day;

    @BeforeEach
    void setUp() {
        patientId = patients.findAll().get(0).getId();
        // a different far-future day per test keeps the tests independent of each other
        day = LocalDate.now().plusYears(1).plusDays(Math.floorMod(System.nanoTime(), 300L));
    }

    private AppointmentBookingRequest request(int chair, String time) {
        AppointmentBookingRequest r = new AppointmentBookingRequest();
        r.setPatientId(patientId);
        r.setDate(day);
        r.setChair(chair);
        r.setTime(time);
        r.setProcedure("Scaling");
        return r;
    }

    @Test
    void sameChairAndTimeCannotBeBookedTwice() {
        appointments.bookAppointment(request(1, "09:00 AM"));
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> appointments.bookAppointment(request(1, "09:00 AM")));
        assertTrue(ex.getMessage().contains("occupied") || ex.getMessage().contains("booked"));
    }

    @Test
    void differentChairAtSameTimeIsAllowed() {
        appointments.bookAppointment(request(1, "09:45 AM"));
        assertDoesNotThrow(() -> appointments.bookAppointment(request(2, "09:45 AM")));
    }

    @Test
    void cancelledSlotCanBeBookedAgain() {
        Appointment first = appointments.bookAppointment(request(3, "10:30 AM"));
        appointments.cancelAppointment(first.getId(), "test");
        assertDoesNotThrow(() -> appointments.bookAppointment(request(3, "10:30 AM")));
    }

    @Test
    void appointmentNumbersStayUniqueAfterADelete() {
        Appointment a = appointments.bookAppointment(request(1, "11:15 AM"));
        Appointment b = appointments.bookAppointment(request(2, "11:15 AM"));
        appointments.deleteAppointment(a.getId());
        Appointment c = appointments.bookAppointment(request(3, "11:15 AM"));

        Set<String> numbers = new HashSet<>(Set.of(a.getAppointmentNumber(), b.getAppointmentNumber(), c.getAppointmentNumber()));
        assertEquals(3, numbers.size(), "appointment numbers must never repeat");
    }

    @Test
    void rescheduleIntoAnOccupiedSlotIsRejected() {
        appointments.bookAppointment(request(1, "12:00 PM"));
        Appointment other = appointments.bookAppointment(request(1, "02:00 PM"));
        assertThrows(IllegalStateException.class,
                () -> appointments.rescheduleAppointment(other.getId(), day, "12:00 PM", null));
    }
}
