package com.dentalclinic.service;

import com.dentalclinic.dto.InvoiceCreateDto;
import com.dentalclinic.dto.PaymentRecordDto;
import com.dentalclinic.model.Invoice;

import java.util.List;
import java.util.Optional;

public interface BillingService {
    List<Invoice> getAllInvoices();
    List<Invoice> getInvoicesForPatient(String patientId);
    Optional<Invoice> getInvoiceById(String id);
    Invoice createInvoice(InvoiceCreateDto dto);
    Invoice recordPayment(String invoiceId, PaymentRecordDto paymentDto);
    void deleteInvoice(String id);
}
