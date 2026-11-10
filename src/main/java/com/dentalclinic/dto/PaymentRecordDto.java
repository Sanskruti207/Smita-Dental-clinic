package com.dentalclinic.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

/**
 * DTO for recording payment against an existing invoice.
 */
public class PaymentRecordDto {

    @NotNull(message = "Payment amount is required")
    @Positive(message = "Payment amount must be greater than zero")
    private BigDecimal amount;

    private String paymentMethod; // Cash, UPI, Credit Card, Insurance
    private String paymentNotes;

    public PaymentRecordDto() {
    }

    public PaymentRecordDto(BigDecimal amount, String paymentMethod, String paymentNotes) {
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentNotes = paymentNotes;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentNotes() { return paymentNotes; }
    public void setPaymentNotes(String paymentNotes) { this.paymentNotes = paymentNotes; }
}
