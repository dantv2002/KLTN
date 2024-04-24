package com.hospitalx.emr.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.Medical;

public interface MedicalRepository extends MongoRepository<Medical, String> {
    @Query(value = " { 'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'mark': {$regex: ?1, $options: 'i'} }")
    Page<Medical> findAllByKeyword(String keyword, String mark, Pageable pageable);
}
