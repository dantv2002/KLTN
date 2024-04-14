package com.hospitalx.emr.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.models.dtos.RecordDto;
import com.hospitalx.emr.services.RecordService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class RecordController {

    @Autowired
    private RecordService recordService;

    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @PostMapping("/patient/record/new")
    public ResponseEntity<BaseResponse> create(@RequestBody @Valid RecordDto recordDto) {
        log.info("Create record: " + recordDto.toString());
        recordService.save(recordDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Create record success");
        response.setStatus(HttpStatus.OK.value());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @GetMapping("/patient/records")
    public ResponseEntity<BaseResponse> getAll() {
        log.info("Get all records");
        BaseResponse response = new BaseResponse();
        response.setData(recordService.getAll(null, null));
        response.setMessage("Get all records success");
        response.setStatus(HttpStatus.OK.value());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    
}
