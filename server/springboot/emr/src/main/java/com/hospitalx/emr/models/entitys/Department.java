package com.hospitalx.emr.models.entitys;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Departments")
@Data
public class Department {

    @Id
    private String id;
    private String nameDepartment;
    private String location;
    private Integer numberOfRooms;
    private Boolean deleted = false;

    private String managerId = null;
}
