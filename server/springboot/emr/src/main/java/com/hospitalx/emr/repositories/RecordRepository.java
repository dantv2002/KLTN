package com.hospitalx.emr.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.hospitalx.emr.models.entitys.Record;

@Repository
public interface RecordRepository extends MongoRepository<Record, String> {
    @Query(value = "{ _id: { $in: ?0 } }")
    Page<Record> findAllById(List<String> ids, Pageable pageable);

    @Query(value = "{ 'fullName': { $regex: ?0, $options: 'i' }, 'dateOfBirth': {$gte: ?1, $lt: ?2}, 'gender': { $regex: ?3} }")
    Page<Record> findAllByKeyword(String keyword, Date startDate, Date endDate, String gender, Pageable pageable);

    @Query(value = "{ 'fullName': { $regex: ?0, $options: 'i' }, 'gender': { $regex: ?1} }")
    Page<Record> findAllByKeyword(String keyword, String gender, Pageable pageable);

    @Query(value = "{ 'createdAt': {$gte: ?0, $lt: ?1}, 'deleted': false }")
    List<Record> findAllByDateBetween(Date startDate, Date endDate);

    @Query(value = "{'deleted': false }", count = true)
    int totalRecord();
}
