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
import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.services.HealthcareStaffService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class HealthcareStaffController {
    @Autowired
    private HealthcareStaffService healthcareStaffService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/admin/healthcare-staff/new")
    public ResponseEntity<BaseResponse> create(@RequestBody @Valid HealthcareStaffDto healthcareStaffDto) {
        healthcareStaffService.save(healthcareStaffDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tạo nhân viên y tế thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PATIENT')")
    @GetMapping({"/admin/healthcare-staffs", "/patient/doctors"})
    public ResponseEntity<BaseResponse> getAll(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "type", defaultValue = "", required = false) String type,
            @RequestParam(name = "title", defaultValue = "", required = false) String title,
            @RequestParam(name = "department", defaultValue = "", required = false) String department,
            @RequestParam(name = "gender", defaultValue = "", required = false) String gender,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        keyword = keyword + "_" + title + "_" + department + "_" + gender;
        Page<HealthcareStaffDto> data = healthcareStaffService.getAll(keyword, type, pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải danh sách nhân viên y tế thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("HealthCareStaffs", data.getContent());
                put("CurrentPage", data.getNumber());
                put("NumberOfItems", data.getNumberOfElements());
                put("TotalItems", data.getTotalElements());
                put("TotalPages", data.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/healthcare-staff/{id}")
    public ResponseEntity<BaseResponse> get(@PathVariable("id") String id) {
        HealthcareStaffDto data = healthcareStaffService.get(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải thông tin nhân viên y tế thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("HealthCareStaff", data);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/healthcare-staff")
    public ResponseEntity<BaseResponse> update(@RequestBody @Valid HealthcareStaffDto healthcareStaffDto) {
        healthcareStaffService.update(healthcareStaffDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Cập nhật thông tin nhân viên y tế thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/healthcare-staff/{id}")
    public ResponseEntity<BaseResponse> delete(@PathVariable("id") String id) {
        healthcareStaffService.delete(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa nhân viên y tế thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // API support api create account for healthcare staff
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/healthcare-staffs/account")
    public ResponseEntity<BaseResponse> getAllNotAccount(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "type", defaultValue = "", required = false) String type,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<HealthcareStaffDto> data = healthcareStaffService.getAllForAccount(keyword, type, pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải danh sách nhân viên y tế thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("HealthCareStaffs", data.getContent());
                put("CurrentPage", data.getNumber());
                put("NumberOfItems", data.getNumberOfElements());
                put("TotalItems", data.getTotalElements());
                put("TotalPages", data.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
