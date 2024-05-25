package com.hospitalx.emr.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.Department;

public interface DepartmentRepository extends MongoRepository<Department, String> {
    @Query("{'nameDepartment': {$regex: ?0, $options: 'i'}, 'deleted': false}")
    Page<Department> findByNameDepartment(String nameDepartment, Pageable pageable);

    @Query("{'_id': ?0, 'deleted': false}")
    Optional<Department> findById(String id);

    @Query("{'nameDepartment': {$regex: ?0, $options: 'i'}}")
    Optional<Department> findByNameDepartment(String nameDepartment);

    @Query("{'_id': {$ne: ?0}, 'nameDepartment': {$regex: ?1, $options: 'i'}}")
    Optional<Department> findByNotIdAndNameDepartment(String id, String nameDepartment);
}
