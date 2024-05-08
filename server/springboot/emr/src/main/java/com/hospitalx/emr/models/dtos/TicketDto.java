package com.hospitalx.emr.models.dtos;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hospitalx.emr.common.TicketStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketDto {
    @JsonProperty("Id")
    private String id;
    @JsonProperty("Number")
    private Integer number; // Số thứ tự chờ
    @JsonProperty("Area")
    private String area; // Khu vực khám
    @JsonProperty("Clinic")
    private String clinic; // Phòng khám
    @JsonProperty("Department")
    private String department; // Khoa khám
    @JsonProperty("NameDoctor")
    private String nameDoctor; // Tên bác sĩ khám
    @NotNull(message = "Vui lòng chọn ngày khám")
    @JsonProperty("Date")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date date; // Ngày khám
    @JsonProperty("Time")
    private String time; // Giờ khám dự kiến
    @JsonProperty("Status")
    private TicketStatus status; // Trạng thái
    @JsonProperty("NamePatient")
    private String namePatient; // Tên người khám
    @JsonProperty("DateOfBirth")
    private Date dateOfBirth; // Ngày sinh
    @JsonProperty("RecordId")
    private String recordId; // Mã hồ sơ
    @JsonProperty("Gender")
    private String gender; // Giới tính
    @JsonProperty("HealthInsurance")
    private String healthInsurance; // Bảo hiểm y tế
    @JsonProperty("Address")
    private String address; // Địa chỉ
}
