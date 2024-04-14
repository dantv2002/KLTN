package com.hospitalx.emr.models.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VerificationCodeDto {
    @NotNull(message = "Code cannot be null")
    @Pattern(regexp = "[0-9]{6}", message = "Code must be exactly 6 digits")
    @JsonProperty("Code")
    private String code;

}
