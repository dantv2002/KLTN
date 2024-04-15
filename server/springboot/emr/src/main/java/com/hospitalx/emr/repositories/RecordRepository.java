package com.hospitalx.emr.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.hospitalx.emr.models.entitys.Record;

public interface RecordRepository extends MongoRepository<Record, String> {
    Page<Record> findAllById(List<String> ids, Pageable pageable);
}
