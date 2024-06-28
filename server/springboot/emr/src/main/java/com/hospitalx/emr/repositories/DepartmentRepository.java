package com.hospitalx.emr.repositories;

import java.util.Optional;
import java.util.List;

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

    @Query("{$and :[{'nameDepartment': {$regex: ?0, $options: 'i'}}, {'nameDepartment': {$not: {$regex: ?1, $options: 'i'}}}], 'deleted': false}")
    Page<Department> findByNameDepartmentAndNot(String nameDepartment, String name, Pageable pageable);

    @Query("{'deleted': false}")
    Page<Department> findByAll(Pageable pageable);

    @Query("{'deleted': false, 'allowBooking': ?0}")
    Page<Department> findByAll(Boolean allowBooking, Pageable pageable);

    @Query("{'nameDepartment': {$regex: ?0, $options: 'i'}, 'deleted': false}")
    Optional<Department> findByNameDepartment(String nameDepartment);

    @Query("{'location': ?0, 'deleted': false}")
    List<Department> findAllByLocation(String location);

    @Query("{'_id': {$ne: ?0}, 'location': ?1, 'deleted': false}")
    List<Department> findAllByNotIdAndLocation(String id, String location);

    @Query("{'_id': {$ne: ?0}, 'nameDepartment': {$regex: ?1, $options: 'i'}, 'deleted': false}")
    Optional<Department> findByNotIdAndNameDepartment(String id, String nameDepartment);
}
