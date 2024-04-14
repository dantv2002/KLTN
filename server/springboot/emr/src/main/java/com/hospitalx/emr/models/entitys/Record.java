package com.hospitalx.emr.models.entitys;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Records")
@Data
public class Record {

    @Id
    private String id;
    private String email;
    private String fullName;
    private Date dateOfBirth;
    private Boolean gender;
    private String numberPhone;
    private String identityCard = null;
    private String address;
    private String healthInsurance = null;
}
