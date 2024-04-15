package com.hospitalx.emr.models.dtos;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mongodb.lang.NonNull;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RecordDto {
    @JsonProperty("Id")
    private String id;

    @NotEmpty(message = "Vui lòng nhập email")
    @Email(message = "Vui lòng nhập đúng định dạng email")
    @JsonProperty("Email")
    private String email;

    @NotEmpty(message = "Vui lòng nhập họ và tên")
    @JsonProperty("FullName")
    private String fullName;

    @NotNull(message = "Vui lòng chọn ngày sinh")
    @JsonProperty("DateOfBirth")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date dateOfBirth;

    @NotEmpty(message = "Vui lòng chọn giới tính")
    @JsonProperty("Gender")
    @Pattern(regexp = "Nam|Nữ|Khác", message = "Giới tính phải là Nam, Nữ hoặc Khác")
    private String gender;

    @NotEmpty(message = "Vui lòng nhập số điện thoại")
    @JsonProperty("NumberPhone")
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String numberPhone;

    @JsonProperty("IdentityCard")
    @Pattern(regexp = "(^[0-9]{12}$)", message = "Vui lòng nhập đúng định dạng số căn cước công dân (12 chữ số)")
    private String identityCard;

    @NotEmpty(message = "Vui lòng nhập địa chỉ sinh sống")
    @JsonProperty("Address")
    private String address;

    @JsonProperty("HealthInsurance")
    @Pattern(regexp = "^[a-zA-Z]{2}[0-9]{13}$", message = "Vui lòng nhập đúng định dạng mã thẻ bảo hiểm y tế")
    private String healthInsurance;
}
