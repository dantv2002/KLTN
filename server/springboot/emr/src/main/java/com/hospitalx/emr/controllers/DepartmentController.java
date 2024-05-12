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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.models.dtos.DepartmentDto;
import com.hospitalx.emr.services.DepartmentService;

@RestController
@RequestMapping("/api")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PreAuthorize("hasRole('ROLE_RECEPTIONIST')")
    @GetMapping("/receptionist/departments")
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
        response.setMessage("Tải danh sách phòng khám thành công");
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
}
