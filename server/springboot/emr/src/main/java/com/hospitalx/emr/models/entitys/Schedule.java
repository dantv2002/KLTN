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
    private Integer number; // Số lượng chờ
    private String clinic; // Phòng khám

    private String doctorId; // ID bác sĩ khám
}
