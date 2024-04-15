package com.hospitalx.emr.models.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VerificationCodeDto {
    @NotEmpty(message = "Vui lòng nhập mã xác minh")
    @Pattern(regexp = "^[0-9]{6}$", message = "Mã xác minh phải có 6 chữ số")
    @JsonProperty("Code")
    private String code;

}
