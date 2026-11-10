package com.dentalclinic.controller;

import com.dentalclinic.dto.InvoiceCreateDto;
import com.dentalclinic.dto.PaymentRecordDto;
import com.dentalclinic.model.Invoice;
import com.dentalclinic.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Billing, Treatment Invoicing, and Payment Checkout.
 * Endpoints:
 * - GET /api/billing/invoices : All clinic billing records
 * - GET /api/billing/patient/{patientId} : Specific patient's invoice history
 * - POST /api/billing/invoices : Generate treatment invoice
 * - POST /api/billing/invoices/{id}/pay : Record cash/card/UPI payment
 */
@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(billingService.getAllInvoices());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("@access.canAccessPatient(#patientId)")
    public ResponseEntity<List<Invoice>> getPatientInvoices(@PathVariable String patientId) {
        return ResponseEntity.ok(billingService.getInvoicesForPatient(patientId));
    }

    @GetMapping("/invoices/{id}")
    @PreAuthorize("@access.canAccessInvoice(#id)")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable String id) {
        return billingService.getInvoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/invoices")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody InvoiceCreateDto dto) {
        return ResponseEntity.ok(billingService.createInvoice(dto));
    }

    @PostMapping("/invoices/{id}/pay")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Invoice> recordPayment(
            @PathVariable String id,
            @Valid @RequestBody PaymentRecordDto paymentDto) {
        return ResponseEntity.ok(billingService.recordPayment(id, paymentDto));
    }

    @DeleteMapping("/invoices/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteInvoice(@PathVariable String id) {
        billingService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
