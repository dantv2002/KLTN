package com.hospitalx.emr.models.entitys;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.hospitalx.emr.common.NurseLevel;
import com.hospitalx.emr.common.StaffType;

import lombok.Data;

@Document(collection = "HealthcareStaffs")
@Data
public class HealthcareStaff {
    @Id
    private String id;
    private String fullName;
    private Date dateOfBirth;
    private String gender;
    private String numberPhone;
    private String identityCard;
    private String address;
    private Boolean deleted = false;

    private String accountId;
    private String departmentId;

    private StaffType staffType; // loại nhân viên
    // Doctor
    private String title;
    // Nurse
    private NurseLevel level;
    // Receptionist
    private String computerLiteracy;
}
