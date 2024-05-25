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
import com.hospitalx.emr.models.dtos.DepartmentDto;
import com.hospitalx.emr.services.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/admin/department/new")
    public ResponseEntity<BaseResponse> create(@RequestBody @Valid DepartmentDto departmentDto) {
        departmentService.create(departmentDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tạo khoa mới thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPTIONIST', 'ROLE_PATIENT', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    @GetMapping({ "/receptionist/departments", "/nurse-doctor/departments", "/admin/departments", "/patient/departments" })
    public ResponseEntity<BaseResponse> getAll(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<DepartmentDto> data = departmentService.getAll(keyword, "", pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải danh sách khoa thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<>() {
            {
                put("Departments", data.getContent());
                put("CurrentPage", data.getNumber());
                put("NumberOfItems", data.getNumberOfElements());
                put("TotalItems", data.getTotalElements());
                put("TotalPages", data.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/department/{id}")
    public ResponseEntity<BaseResponse> get(@PathVariable("id") String id) {
        DepartmentDto department = departmentService.get(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải thông tin khoa thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<>() {
            {
                put("Department", department);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/department")
    public ResponseEntity<BaseResponse> update(@RequestBody @Valid DepartmentDto departmentDto) {
        departmentService.update(departmentDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Cập nhật thông tin khoa thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/department/{id}")
    public ResponseEntity<BaseResponse> delete(@PathVariable("id") String id) {
        departmentService.delete(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa khoa thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
