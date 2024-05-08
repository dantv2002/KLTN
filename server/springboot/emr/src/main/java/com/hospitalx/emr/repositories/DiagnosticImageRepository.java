package com.hospitalx.emr.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hospitalx.emr.models.entitys.DiagnosticImage;

public interface DiagnosticImageRepository extends MongoRepository<DiagnosticImage, String>{
    
}
