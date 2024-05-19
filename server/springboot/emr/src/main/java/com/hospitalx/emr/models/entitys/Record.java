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
    private String gender;
    private String identityCard = null;
    private String address;
    private String healthInsurance = null;
    private String numberPhone;

    private Boolean locked = false;
    private Boolean deleted = false;

    private Date createdAt;
}
