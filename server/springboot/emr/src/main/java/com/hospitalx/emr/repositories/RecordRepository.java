package com.hospitalx.emr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.hospitalx.emr.models.entitys.Record;

public interface RecordRepository extends MongoRepository<Record, String> {

}
