package com.hospitalx.emr.models.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DepartmentDto {
    @JsonProperty("Id")
    private String id;
    @NotEmpty(message = "Vui lòng nhập tên khoa")
    @JsonProperty("NameDepartment")
    private String nameDepartment;
    @NotEmpty(message = "Vui lòng nhập vị trí khoa")
    @JsonProperty("Location")
    private String location;
    @NotEmpty(message = "Vui lòng nhập danh sách phòng của khoa")
    @JsonProperty("Clinics")
    private List<String> clinics;
    @NotNull(message = "Vui lòng chọn cho phép đặt lịch hoặc không")
    @JsonProperty("AllowBooking")
    private Boolean allowBooking;
    private Boolean deleted = false;
}
