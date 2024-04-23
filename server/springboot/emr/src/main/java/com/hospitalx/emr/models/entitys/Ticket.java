package com.hospitalx.emr.models.entitys;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.hospitalx.emr.common.TicketStatus;

import lombok.Data;

@Document(collection = "Tickets")
@Data
public class Ticket {
    @Id
    private String id;
    private Integer number; // Số thứ tự chờ
    private String area; // Khu vực khám
    private String clinic; // Phòng khám
    private String department; // Khoa khám
    private String nameDoctor; // Tên bác sĩ khám
    private Date date; // Ngày khám
    private String time; // Giờ khám dự kiến
    private TicketStatus status; // Trạng thái
    private String namePatient; // Tên người khám
    private Date dateOfBirth; // Ngày sinh
    private String gender; // Giới tính
    private String healthInsurance; // Bảo hiểm y tế
    private String address; // Địa chỉ
}
