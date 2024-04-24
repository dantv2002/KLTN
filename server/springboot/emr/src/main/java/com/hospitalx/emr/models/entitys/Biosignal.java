package com.hospitalx.emr.models.entitys;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class Biosignal {
    @NotEmpty(message = "Vui lòng nhập mạch đập")
    @JsonProperty("HeartRate")
    private String heartRate; // Mạch đập lần/phút
    @NotEmpty(message = "Vui lòng nhập nhiệt độ")
    @JsonProperty("Temperature")
    private String temperature; // Nhiệt độ
    @NotEmpty(message = "Vui lòng nhập huyết áp")
    @JsonProperty("BloodPressure")
    private String bloodPressure; // Huyết áp
    @NotEmpty(message = "Vui lòng nhập nhịp thở")
    @JsonProperty("RespiratoryRate")
    private String respiratoryRate; // Nhịp thở lần/phút
    @NotEmpty(message = "Vui lòng nhập cân nặng")
    @JsonProperty("Weight")
    private String weight; // Cân nặng
}
