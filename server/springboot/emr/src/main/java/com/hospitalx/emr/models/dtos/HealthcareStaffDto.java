package com.hospitalx.emr.models.dtos;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hospitalx.emr.common.NurseLevel;
import com.hospitalx.emr.common.StaffType;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HealthcareStaffDto {
    @JsonProperty("Id")
    private String id;

    @NotEmpty(message = "Vui lòng nhập họ tên")
    @JsonProperty("FullName")
    private String fullName;

    @NotNull(message = "Vui lòng nhập ngày sinh")
    @JsonProperty("DateOfBirth")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date dateOfBirth;

    @NotEmpty(message = "Vui lòng nhập giới tính")
    @JsonProperty("Gender")
    @Pattern(regexp = "Nam|Nữ|Khác", message = "Giới tính phải là Nam, Nữ hoặc Khác")
    private String gender;

    @NotEmpty(message = "Vui lòng nhập số điện thoại")
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải có 10 chữ số")
    @JsonProperty("NumberPhone")
    private String numberPhone;

    @NotEmpty(message = "Vui lòng nhập số CCCD")
    @JsonProperty("IdentityCard")
    @Pattern(regexp = "(^[0-9]{12}$)", message = "Vui lòng nhập đúng định dạng số căn cước công dân (12 chữ số)")
    private String identityCard;

    @NotEmpty(message = "Vui lòng nhập địa chỉ sinh sống")
    @JsonProperty("Address")
    private String address;

    @NotNull(message = "Vui lòng nhập loại nhân viên")
    @JsonProperty("StaffType")
    private StaffType staffType; // loại nhân viên
    // Doctor
    @JsonProperty("Title")
    @Pattern(regexp = "Ths|TS|BS|BSCKI|BSCKII", message = "Chức danh phải là Ths, TS, BS, BSCKI hoặc BSCKII")
    private String title;
    @JsonProperty("Schedules")
    private List<String> schedules;
    // Nurse
    @JsonProperty("Level")
    private NurseLevel level;
    // Receptionist
    @JsonProperty("ComputerLiteracy")
    private String computerLiteracy;

    private String accountId;

    @NotEmpty(message = "Vui lòng chọn khoa làm việc cho nhân viên này")
    @JsonProperty("DepartmentId")
    private String departmentId;

    @JsonProperty("DepartmentName")
    private String departmentName;
}
