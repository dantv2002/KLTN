package com.hospitalx.emr.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.Medical;

public interface MedicalRepository extends MongoRepository<Medical, String> {
    @Query(value = " { 'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'mark': {$regex: ?1, $options: 'i'}, 'recordId': {$regex: ?2}, 'doctorIdTreatment': {$regex: ?3} } ")
    Page<Medical> findAllByKeyword(String keyword, String mark, String recordId, String doctorId, Pageable pageable);

    @Query(value = " {'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'result': {$regex: ?1, $options: 'i'}, 'dueDate': {$lte: ?2 } } ")
    Page<Medical> findAllByDueDate(String keyword, String type, Date date, Pageable pageable);

    @Query(value = " {'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'result': {$nin: ['DEATH', 'ACCIDENT']}, 'dueDate': {$lte: ?1 } } ")
    Page<Medical> findAllByDueDate(String keyword, Date date, Pageable pageable);

    @Query(value = " { 'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'recordId': {$regex: ?1}, 'locked': true } ")
    Page<Medical> findAllByKeyword(String keyword, String recordId, Pageable pageable);

    @Query(value = " { 'recordId': ?0, 'createDate': {$gte: ?1, $lte: ?2}, 'locked': true } ")
    List<Medical> findAllByRecordIdAndDateBetween(String recordId, Date startDate, Date endDate);
}
