package com.hospitalx.emr.models.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hospitalx.emr.common.AuthProvider;
import com.hospitalx.emr.models.entitys.Verify;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountDto {
    @JsonProperty("Id")
    private String id;

    @JsonProperty("FullName")
    private String fullName;
    private String imageUrl;

    @NotEmpty(message = "Vui lòng nhập email")
    @Email(message = "Vui lòng nhập đúng định dạng email")
    @JsonProperty("Email")
    private String email;
    private Boolean emailVerified;

    @NotEmpty(message = "Vui lòng nhập mật khẩu")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\\-+]).{8,20}$", message = "Mật khẩu phải chứa ít nhất 1 chữ số, 1 chữ thường, 1 chữ hoa, 1 ký tự đặc biệt và có độ dài từ 8-20 ký tự")
    @JsonProperty("Password")
    private String password;
    
    @NotEmpty(message = "Vui lòng xác nhận mật khẩu")
    @JsonProperty("ConfirmPassword")
    private String confirmPassword;
    private String role;
    private Boolean actived;

    private AuthProvider authProvider;
    private Boolean deleted;
    private Verify verify;
    private List<String> records;
}
