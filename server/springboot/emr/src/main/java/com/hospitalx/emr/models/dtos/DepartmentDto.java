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
    private Boolean deleted = false;
}
