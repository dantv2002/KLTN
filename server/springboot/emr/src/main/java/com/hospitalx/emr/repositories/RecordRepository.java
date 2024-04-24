package com.hospitalx.emr.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.Record;

public interface RecordRepository extends MongoRepository<Record, String> {
    @Query(value = "{ _id: { $in: ?0 } }")
    Page<Record> findAllById(List<String> ids, Pageable pageable);

    @Query(value = "{ 'fullName': { $regex: ?0, $options: 'i' }, 'dateOfBirth': {$gte: ?1, $lte: ?2},'gender': { $regex: ?3} }")
    Page<Record> findAllByKeyword(String keyword, Date startDate, Date endDate, String gender, Pageable pageable);

    @Query(value = "{ 'fullName': { $regex: ?0, $options: 'i' }, 'gender': { $regex: ?1} }")
    Page<Record> findAllByKeyword(String keyword, String gender, Pageable pageable);
}
