package com.hospitalx.emr.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.hospitalx.emr.models.entitys.Department;


@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {
    @Query("{'nameDepartment': {$regex: ?0, $options: 'i'}, 'deleted': false}")
    Page<Department> findByNameDepartment(String nameDepartment, Pageable pageable);

    @Query("{'deleted': false}")
    Page<Department> findByAll(Pageable pageable);

    @Query("{'deleted': false, 'nameDepartment': {$nin: ?0}}")
    Page<Department> findByAll(List<String> nameDepartment, Pageable pageable);

    @Query("{'nameDepartment': {$regex: ?0, $options: 'i'}}")
    Optional<Department> findByNameDepartment(String nameDepartment);

    @Query("{'_id': {$ne: ?0}, 'nameDepartment': {$regex: ?1, $options: 'i'}}")
    Optional<Department> findByNotIdAndNameDepartment(String id, String nameDepartment);
}
