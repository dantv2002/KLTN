package com.hospitalx.emr.models.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DepartmentDto {
    @JsonProperty("Id")
    private String id;
    @NotEmpty(message = "Vui lòng nhập tên khoa")
    @JsonProperty("NameDepartment")
    private String nameDepartment;
    @NotEmpty(message = "Vui lòng nhập vị trí")
    @JsonProperty("Location")
    private String location;
    @NotEmpty(message = "Vui lòng nhập số lượng phòng")
    @JsonProperty("NumberOfRooms")
    private Integer numberOfRooms;
    private Boolean deleted = false;

    @NotEmpty(message = "Vui lòng nhập mã trưởng khoa")
    @JsonProperty("ManagerId")
    private String managerId;
}
