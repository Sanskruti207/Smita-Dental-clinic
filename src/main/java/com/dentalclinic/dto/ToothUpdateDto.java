package com.dentalclinic.dto;

import com.dentalclinic.model.ToothCondition;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for updating a patient's Odontogram tooth condition.
 */
public class ToothUpdateDto {

    @NotNull(message = "Tooth number is required")
    @Min(value = 1, message = "Tooth number must be between 1 and 32")
    @Max(value = 32, message = "Tooth number must be between 1 and 32")
    private Integer toothNumber;

    @NotNull(message = "Condition is required")
    private ToothCondition condition;

    private String notes;

    public ToothUpdateDto() {
    }

    public ToothUpdateDto(Integer toothNumber, ToothCondition condition, String notes) {
        this.toothNumber = toothNumber;
        this.condition = condition;
        this.notes = notes;
    }

    public Integer getToothNumber() { return toothNumber; }
    public void setToothNumber(Integer toothNumber) { this.toothNumber = toothNumber; }

    public ToothCondition getCondition() { return condition; }
    public void setCondition(ToothCondition condition) { this.condition = condition; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
