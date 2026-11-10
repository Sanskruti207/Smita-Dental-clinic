package com.dentalclinic.service.impl;

import com.dentalclinic.dto.InvoiceCreateDto;
import com.dentalclinic.dto.PaymentRecordDto;
import com.dentalclinic.model.*;
import com.dentalclinic.repository.InvoiceRepository;
import com.dentalclinic.repository.PatientRepository;
import com.dentalclinic.service.BillingService;
import com.dentalclinic.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service implementation for Patient Invoicing, GST tax, and payment collection.
 */
@Service
@Transactional
public class BillingServiceImpl implements BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PatientRepository patientRepository;
    private final NotificationService notificationService;

    public BillingServiceImpl(InvoiceRepository invoiceRepository,
                              PatientRepository patientRepository,
                              NotificationService notificationService) {
        this.invoiceRepository = invoiceRepository;
        this.patientRepository = patientRepository;
        this.notificationService = notificationService;
    }

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public List<Invoice> getInvoicesForPatient(String patientId) {
        return invoiceRepository.findByPatientIdOrderByDateDesc(patientId);
    }

    @Override
    public Optional<Invoice> getInvoiceById(String id) {
        return invoiceRepository.findById(id);
    }

    @Override
    public Invoice createInvoice(InvoiceCreateDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + dto.getPatientId()));

        long count = invoiceRepository.count() + 41;
        String invCode = "INV-2026-" + String.format("%03d", count);

        Invoice invoice = new Invoice();
        invoice.setId("inv-" + UUID.randomUUID().toString().substring(0, 8));
        invoice.setInvoiceNumber(invCode);
        invoice.setPatientId(patient.getId());
        invoice.setPatientName(patient.getName());
        invoice.setPatientPhone(patient.getPhone());
        invoice.setDate(LocalDate.now());
        invoice.setDueDate(dto.getDueDate());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (InvoiceCreateDto.ItemDto itemDto : dto.getItems()) {
            BigDecimal lineTotal = itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            InvoiceItem item = new InvoiceItem(
                    "item-" + UUID.randomUUID().toString().substring(0, 8),
                    itemDto.getDescription(),
                    itemDto.getCode(),
                    itemDto.getQuantity(),
                    itemDto.getUnitPrice(),
                    lineTotal
            );
            invoice.addItem(item);
        }

        invoice.setSubtotal(subtotal);
        BigDecimal discount = dto.getDiscount() != null ? dto.getDiscount() : BigDecimal.ZERO;
        BigDecimal tax = dto.getTax() != null ? dto.getTax() : BigDecimal.ZERO;
        invoice.setDiscount(discount);
        invoice.setTax(tax);

        BigDecimal grandTotal = subtotal.subtract(discount).add(tax);
        invoice.setGrandTotal(grandTotal);

        BigDecimal amountPaid = dto.getAmountPaid() != null ? dto.getAmountPaid() : BigDecimal.ZERO;
        invoice.setAmountPaid(amountPaid);
        BigDecimal balance = grandTotal.subtract(amountPaid);
        invoice.setBalanceDue(balance);

        if (balance.compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setStatus(PaymentStatus.PAID);
        } else if (amountPaid.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setStatus(PaymentStatus.PARTIAL);
        } else {
            invoice.setStatus(PaymentStatus.UNPAID);
        }

        invoice.setPaymentMethod(dto.getPaymentMethod());
        invoice.setPaymentNotes(dto.getPaymentNotes());

        Invoice saved = invoiceRepository.save(invoice);

        // Update Patient Account Balance
        patient.setTotalSpent(patient.getTotalSpent().add(amountPaid));
        patient.setBalanceDue(patient.getBalanceDue().add(balance));
        patientRepository.save(patient);

        return saved;
    }

    @Override
    public Invoice recordPayment(String invoiceId, PaymentRecordDto paymentDto) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));

        BigDecimal currentPaid = invoice.getAmountPaid();
        BigDecimal newPaid = currentPaid.add(paymentDto.getAmount());
        invoice.setAmountPaid(newPaid);

        BigDecimal newBalance = invoice.getGrandTotal().subtract(newPaid);
        if (newBalance.compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setBalanceDue(BigDecimal.ZERO);
            invoice.setStatus(PaymentStatus.PAID);
        } else {
            invoice.setBalanceDue(newBalance);
            invoice.setStatus(PaymentStatus.PARTIAL);
        }

        invoice.setPaymentMethod(paymentDto.getPaymentMethod());
        invoice.setPaymentNotes(paymentDto.getPaymentNotes());

        Invoice updated = invoiceRepository.save(invoice);

        // Update Patient Balance
        Patient patient = patientRepository.findById(invoice.getPatientId()).orElse(null);
        if (patient != null) {
            patient.setTotalSpent(patient.getTotalSpent().add(paymentDto.getAmount()));
            BigDecimal updatedPatientBalance = patient.getBalanceDue().subtract(paymentDto.getAmount());
            patient.setBalanceDue(updatedPatientBalance.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : updatedPatientBalance);
            patientRepository.save(patient);
        }

        // Send payment receipt SMS
        notificationService.sendNotification(
                "SMS",
                invoice.getPatientName(),
                invoice.getPatientPhone(),
                "Payment Received: " + invoice.getInvoiceNumber(),
                "Thank you! Payment of Rs. " + paymentDto.getAmount() + " received. Balance: Rs. " + invoice.getBalanceDue(),
                invoice.getPatientId(),
                "PATIENT"
        );

        return updated;
    }

    @Override
    public void deleteInvoice(String id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + id));
        patientRepository.findById(invoice.getPatientId()).ifPresent(p -> {
            BigDecimal spent = p.getTotalSpent().subtract(invoice.getAmountPaid());
            BigDecimal due = p.getBalanceDue().subtract(invoice.getBalanceDue());
            p.setTotalSpent(spent.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : spent);
            p.setBalanceDue(due.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : due);
            patientRepository.save(p);
        });
        invoiceRepository.delete(invoice);
    }
}
