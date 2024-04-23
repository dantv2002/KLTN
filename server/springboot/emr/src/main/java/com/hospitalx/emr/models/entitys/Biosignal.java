package com.hospitalx.emr.models.entitys;

import lombok.Data;

@Data
public class Biosignal {
    private String heartRate; // Mạch đập lần/phút
    private String temperature; // Nhiệt độ
    private String bloodPressure; // Huyết áp
    private String respiratoryRate; // Nhịp thở lần/phút
    private String weight; // Cân nặng
}
