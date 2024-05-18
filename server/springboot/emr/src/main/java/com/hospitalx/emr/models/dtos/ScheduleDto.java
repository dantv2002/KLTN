package com.hospitalx.emr.models.dtos;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hospitalx.emr.common.ScheduleTime;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScheduleDto {
    @JsonProperty("Id")
    private String id;

    @NotNull(message = "Vui lòng chọn ngày khám")
    @JsonProperty("Date")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date date;

    @NotNull(message = "Vui lòng chọn buổi khám")
    @JsonProperty("Time")
    private ScheduleTime time;

    @JsonProperty("Number")
    private Integer number;

    @JsonProperty("CallNumber")
    private Integer callNumber;

    @NotEmpty(message = "Vui lòng chọn phòng khám")
    @JsonProperty("Clinic")
    private String clinic;

    @JsonProperty("DoctorId")
    private String doctorId;
}
