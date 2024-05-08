package com.hospitalx.emr.repositories;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.Medical;

public interface MedicalRepository extends MongoRepository<Medical, String> {
    @Query(value = " { 'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'mark': {$regex: ?1, $options: 'i'}, 'recordId': {$regex: ?2} } ")
    Page<Medical> findAllByKeyword(String keyword, String mark, String recordId, Pageable pageable);

    @Query(value = " {'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'result': {$regex: ?1, $options: 'i'}, 'dueDate': {$gte: ?2 } } ")
    Page<Medical> findAllByDueDate(String keyword, String type, Date date, Pageable pageable);

    @Query(value = " {'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'result': {$nin: ['DEATH', 'ACCIDENT']}, 'dueDate': {$gte: ?1 } } ")
    Page<Medical> findAllByDueDate(String keyword, Date date, Pageable pageable);
}
