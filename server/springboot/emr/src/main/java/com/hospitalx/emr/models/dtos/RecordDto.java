package com.hospitalx.emr.models.dtos;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RecordDto {
    @JsonProperty("Id")
    private String id;

    @NotEmpty(message = "Please enter your email")
    @Email(message = "Please enter valid email address")
    @JsonProperty("Email")
    private String email;

    @NotEmpty(message = "Please enter your full name")
    @JsonProperty("FullName")
    private String fullName;

    @NotEmpty(message = "Please enter your date of birth")
    @JsonProperty("DateOfBirth")
    @JsonFormat(pattern = "MM/dd/yyyy")
    private Date dateOfBirth;

    @NotEmpty(message = "Please select your gender")
    @JsonProperty("Gender")
    private Boolean gender;

    @NotEmpty(message = "Please enter your phone number")
    @JsonProperty("NumberPhone")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String numberPhone;

    @JsonProperty("IdentityCard")
    @Pattern(regexp = "(^[0-9]{12}$)|(^[a-zA-Z][0-9]{7}$)", message = "Identity Card must be 12 digits or start with a letter followed by 7 digits")
    private String identityCard;

    @NotEmpty(message = "Please enter your address")
    @JsonProperty("Address")
    private String address;

    @JsonProperty("HealthInsurance")
    @Pattern(regexp = "^[a-zA-Z]{2}[0-9]{13}$", message = "Health Card must start with 2 letters followed by 13 digits")
    private String healthInsurance;
}
