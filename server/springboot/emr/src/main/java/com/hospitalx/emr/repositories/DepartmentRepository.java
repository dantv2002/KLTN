package com.hospitalx.emr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hospitalx.emr.models.entitys.Department;

public interface DepartmentRepository extends MongoRepository<Department, String>{
    
}
