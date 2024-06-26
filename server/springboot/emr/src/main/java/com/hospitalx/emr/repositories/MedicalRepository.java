package com.hospitalx.emr.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.hospitalx.emr.models.entitys.Medical;

@Repository
public interface MedicalRepository extends MongoRepository<Medical, String> {
    @Query(value = " { 'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'mark': {$regex: ?1, $options: 'i'}, 'recordId': {$regex: ?2}, 'doctorIdTreatment': {$regex: ?3}, 'locked': ?4 } ")
    Page<Medical> findAllByKeyword(String keyword, String mark, String recordId, String doctorId, Boolean isLocked, Pageable pageable);

    @Query(value = " { 'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'mark': {$regex: ?1, $options: 'i'}, 'recordId': {$regex: ?2}, 'doctorIdTreatment': {$regex: ?3} } ")
    Page<Medical> findAllByKeyword(String keyword, String mark, String recordId, String doctorId, Pageable pageable);

    @Query(value = " { 'reason': {$regex: ?0, $options: 'i'}, 'recordId': {$regex: ?1}, 'locked': ?2 } ")
    Page<Medical> findAllByKeyword(String keyword, String recordId, Boolean isLocked, Pageable pageable);

    @Query(value = " {'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'result': {$regex: ?1, $options: 'i'}, 'dueDate': {$lt: ?2 } } ")
    Page<Medical> findAllByDueDate(String keyword, String type, Date date, Pageable pageable);

    @Query(value = " {'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'result': {$nin: ['DEATH', 'ACCIDENT']}, 'dueDate': {$lt: ?1 } } ")
    Page<Medical> findAllByDueDate(String keyword, Date date, Pageable pageable);

    @Query(value = " { 'diagnosisDischarge': {$regex: ?0, $options: 'i'}, 'recordId': {$regex: ?1}, 'locked': true } ")
    Page<Medical> findAllByKeyword(String keyword, String recordId, Pageable pageable);

    @Query(value = " { 'recordId': ?0, 'createdAt': {$gte: ?1, $lte: ?2}, 'locked': true } ")
    List<Medical> findAllByRecordIdAndDateBetween(String recordId, Date startDate, Date endDate);

    @Query(value = " { 'createdAt': {$gte: ?0, $lt: ?1} } ")
    List<Medical> findAllByDateBetween(Date startDate, Date endDate);

    @Query(value = "{ 'locked': false }", count = true)
    int totalMedicalNew();

    @Query(value = "{ 'locked': true }", count = true)
    int totalMedicalLocked();

    @Query(value = "{ 'locked': true, 'dueDate': {$lt: ?0} }", count = true)
    int totalMedicalExpired(Date date);

    @Query(value = "{ 'recordId': ?0 }", count = true)
    int countByRecordId(String recordId);
}
