package com.dentalclinic.repository;

import com.dentalclinic.model.Invoice;
import com.dentalclinic.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Patient billing invoices.
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    List<Invoice> findByPatientIdOrderByDateDesc(String patientId);
    void deleteByPatientId(String patientId);
    List<Invoice> findByStatus(PaymentStatus status);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}
