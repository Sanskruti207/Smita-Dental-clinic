package com.dentalclinic;

import com.dentalclinic.dto.InvoiceCreateDto;
import com.dentalclinic.dto.PaymentRecordDto;
import com.dentalclinic.model.Invoice;
import com.dentalclinic.model.PaymentStatus;
import com.dentalclinic.repository.PatientRepository;
import com.dentalclinic.service.BillingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BillingServiceTest {

    @Autowired BillingService billing;
    @Autowired PatientRepository patients;

    private InvoiceCreateDto.ItemDto item(String name, int qty, String price) {
        InvoiceCreateDto.ItemDto i = new InvoiceCreateDto.ItemDto();
        i.setDescription(name);
        i.setQuantity(qty);
        i.setUnitPrice(new BigDecimal(price));
        return i;
    }

    private Invoice createInvoice(String amountPaid) {
        InvoiceCreateDto dto = new InvoiceCreateDto();
        dto.setPatientId(patients.findAll().get(0).getId());
        dto.setDueDate(LocalDate.now().plusDays(7));
        dto.setDiscount(new BigDecimal("100"));
        dto.setTax(new BigDecimal("50"));
        dto.setAmountPaid(new BigDecimal(amountPaid));
        dto.setItems(List.of(item("Scaling", 2, "500"), item("X-Ray", 1, "300")));
        return billing.createInvoice(dto);
    }

    @Test
    void totalsAreCalculatedOnTheServer() {
        Invoice inv = createInvoice("0");
        assertEquals(0, new BigDecimal("1300").compareTo(inv.getSubtotal()));
        assertEquals(0, new BigDecimal("1250").compareTo(inv.getGrandTotal()));   // 1300 - 100 + 50
        assertEquals(0, new BigDecimal("1250").compareTo(inv.getBalanceDue()));
        assertEquals(PaymentStatus.UNPAID, inv.getStatus());
    }

    @Test
    void partialThenFullPaymentUpdatesStatus() {
        Invoice inv = createInvoice("250");
        assertEquals(PaymentStatus.PARTIAL, inv.getStatus());
        assertEquals(0, new BigDecimal("1000").compareTo(inv.getBalanceDue()));

        PaymentRecordDto pay = new PaymentRecordDto();
        pay.setAmount(new BigDecimal("1000"));
        pay.setPaymentMethod("UPI");
        Invoice paid = billing.recordPayment(inv.getId(), pay);

        assertEquals(PaymentStatus.PAID, paid.getStatus());
        assertEquals(0, BigDecimal.ZERO.compareTo(paid.getBalanceDue()));
    }

    @Test
    void deletingAnInvoiceReversesThePatientBalance() {
        var patient = patients.findAll().get(0);
        BigDecimal dueBefore = patient.getBalanceDue();
        Invoice inv = createInvoice("0");
        billing.deleteInvoice(inv.getId());
        BigDecimal dueAfter = patients.findById(patient.getId()).orElseThrow().getBalanceDue();
        assertEquals(0, dueBefore.compareTo(dueAfter));
    }
}
