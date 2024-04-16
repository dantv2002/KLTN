package com.hospitalx.emr.models.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdatePasswordDto {

    @NotEmpty(message = "Vui lòng nhập mật khẩu cũ")
    @JsonProperty("OldPassword")
    private String oldPassword;

    @NotEmpty(message = "Vui lòng nhập mật khẩu")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\\-+]).{8,20}$", message = "Mật khẩu phải chứa ít nhất 1 chữ số, 1 chữ thường, 1 chữ hoa, 1 ký tự đặc biệt và có độ dài từ 8-20 ký tự")
    @JsonProperty("NewPassword")
    private String newPassword;

    @NotEmpty(message = "Vui lòng xác nhận mật khẩu")
    @JsonProperty("ConfirmNewPassword")
    private String confirmNewPassword;
}
