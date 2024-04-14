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

    @NotEmpty(message = "Please enter your email")
    @Email(message = "Please enter valid email address")
    @JsonProperty("Email")
    private String email;
    private Boolean emailVerified;

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\\-+]).{8,20}$", message = "Password must contain at least one digit, one lower case, one upper case, one special character and must be between 8 and 20 characters long")
    @JsonProperty("Password")
    private String password;
    @JsonProperty("ConfirmPassword")
    private String confirmPassword;
    private String role;
    private Boolean actived;

    private AuthProvider authProvider;
    private Boolean deleted;
    private Verify verify;
    private List<String> records;
}
