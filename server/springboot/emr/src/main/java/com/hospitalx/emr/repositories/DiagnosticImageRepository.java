package com.hospitalx.emr.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.DiagnosticImage;

public interface DiagnosticImageRepository extends MongoRepository<DiagnosticImage, String>{
    @Query("{ 'medicalId' : ?0 }")
    Page<DiagnosticImage> findByMedicalId(String medicalId, Pageable pageable);
}
