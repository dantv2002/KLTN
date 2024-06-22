package com.hospitalx.emr.controllers;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.models.dtos.RecordDto;
import com.hospitalx.emr.services.RecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class RecordController {

    @Autowired
    private RecordService recordService;

    @PreAuthorize("hasAnyRole('ROLE_PATIENT', 'ROLE_RECEPTIONIST')")
    @PostMapping({ "/patient/record/new", "/receptionist/record/new" })
    public ResponseEntity<BaseResponse> create(@RequestBody @Valid RecordDto recordDto) {
        recordService.save(recordDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tạo hồ sơ thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_PATIENT', 'ROLE_NURSE', 'ROLE_DOCTOR', 'ROLE_DOCTOR_DIAGNOSTIC_IMAGING', 'ROLE_RECEPTIONIST')")
    @GetMapping({ "/patient/records", "/nurse-doctor/records", "/receptionist/records" })
    public ResponseEntity<BaseResponse> getAll(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "year", defaultValue = "", required = false) String year,
            @RequestParam(name = "gender", defaultValue = "", required = false) String gender,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        keyword = keyword + "_" + year + "_" + gender;
        Page<RecordDto> records = recordService.getAll(keyword, "", pageable);
        BaseResponse response = new BaseResponse();
        response.setData(new HashMap<String, Object>() {
            {
                put("Records", records.getContent());
                put("CurrentPage", records.getNumber());
                put("NumberOfItems", records.getNumberOfElements());
                put("TotalItems", records.getTotalElements());
                put("TotalPages", records.getTotalPages());
            }
        });
        response.setMessage("Tải tất cả hồ sơ thành công");
        response.setStatus(HttpStatus.OK.value());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_PATIENT', 'ROLE_RECEPTIONIST')")
    @GetMapping({ "/patient/record/{id}", "/receptionist/record/{id}" })
    public ResponseEntity<BaseResponse> get(@PathVariable("id") String id) {
        RecordDto recordDto = recordService.get(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải hồ sơ thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Record", recordDto);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_PATIENT', 'ROLE_RECEPTIONIST')")
    @PutMapping({ "/patient/record", "/receptionist/record" })
    public ResponseEntity<BaseResponse> update(@RequestBody @Valid RecordDto recordDto) {
        recordService.update(recordDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Cập nhật hồ sơ thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @DeleteMapping("/patient/record/{id}")
    public ResponseEntity<BaseResponse> delete(@PathVariable("id") String id) {
        recordService.delete(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa hồ sơ thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
