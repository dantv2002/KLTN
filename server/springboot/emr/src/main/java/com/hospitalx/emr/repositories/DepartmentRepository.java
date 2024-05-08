package com.hospitalx.emr.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.Department;

public interface DepartmentRepository extends MongoRepository<Department, String>{
    @Query("{'nameDepartment': {$regex: ?0, $options: 'i'}}")
    Page<Department> findByNameDepartment(String nameDepartment, Pageable pageable);
}
