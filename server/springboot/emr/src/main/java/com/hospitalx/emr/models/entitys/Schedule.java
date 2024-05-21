package com.hospitalx.emr.models.entitys;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.hospitalx.emr.common.ScheduleTime;

import lombok.Data;

@Document(collection = "Schedules")
@Data
public class Schedule {
    @Id
    private String id;
    private Date date; // Ngày khám
    private ScheduleTime time; // Buổi khám
    private Integer number = 0; // Số lượng chờ
    private Integer callNumber = 0; // Số lượng đã gọi
    private String location; // Vị trí khám
    private String clinic; // Phòng khám
    private String doctorId; // Mã bác sĩ
}
