package com.hospitalx.emr.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.hospitalx.emr.models.dtos.MedicalDto;
import com.hospitalx.emr.services.MedicalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class MedicalController {
    @Autowired
    private MedicalService medicalService;

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @PostMapping("/nurse/medical/new")
    public ResponseEntity<BaseResponse> create(@RequestBody @Valid MedicalDto medicalDto) {
        medicalService.save(medicalDto);
        BaseResponse response = new BaseResponse();
        response.setMessage(String.format("Tạo bệnh án %s thành công",
                medicalDto.getType().toString().equals("INPATIENT") ? "nội trú" : "ngoại trú"));
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_NURSE', 'ROLE_DOCTOR', 'ROLE_PATIENT')")
    @GetMapping({ "/nurse-doctor/medicals", "/patient/medicals" })
    public ResponseEntity<BaseResponse> getAll(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "showAll", defaultValue = "false", required = false) String showAll,
            @RequestParam(name = "mark", defaultValue = "", required = false) String mark,
            @RequestParam(name = "record", defaultValue = "", required = false) String recordId,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "createDate", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "desc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        keyword = keyword + "_" + recordId + "_" + showAll;
        Page<MedicalDto> medicals = medicalService.getAll(keyword, mark, pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải danh sách bệnh án thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Medicals", medicals.getContent());
                put("CurrentPage", medicals.getNumber());
                put("NumberOfItems", medicals.getNumberOfElements());
                put("TotalItems", medicals.getTotalElements());
                put("TotalPages", medicals.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_NURSE', 'ROLE_DOCTOR', 'ROLE_PATIENT')")
    @GetMapping({ "/nurse-doctor/medical/{id}", "/patient/medical/{id}" })
    public ResponseEntity<BaseResponse> get(@PathVariable("id") String id) {
        MedicalDto medicalDto = medicalService.get(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải thông tin bệnh án thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Medical", medicalDto);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_NURSE', 'ROLE_DOCTOR')")
    @GetMapping({ "/nurse-doctor/mark-medical/{id}" })
    public ResponseEntity<BaseResponse> mark(@PathVariable("id") String id) {
        String message = medicalService.markMedical(id) == true ? "Đánh dấu sao" : "Bỏ đánh dấu sao";
        BaseResponse response = new BaseResponse();
        response.setMessage(message + " bệnh án thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    @GetMapping("/doctor/lock-medical/{id}")
    public ResponseEntity<BaseResponse> lock(@PathVariable("id") String id) {
        medicalService.lockMedical(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Nhập kho lưu trữ bệnh án thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_NURSE', 'ROLE_DOCTOR')")
    @PutMapping("/nurse-doctor/medical")
    public ResponseEntity<BaseResponse> update(@RequestBody @Valid MedicalDto medicalDto) {
        medicalService.update(medicalDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Cập nhật thông tin bệnh án thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/medical/{id}")
    public ResponseEntity<BaseResponse> delete(@PathVariable("id") String id) {
        medicalService.delete(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa bệnh án thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/medicals")
    public ResponseEntity<BaseResponse> deleteAll(@RequestBody Map<String, List<String>> request) {
        List<String> ids = request.get("Id");
        medicalService.deleteAll(ids);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa tất cả bệnh án thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/medicals")
    public ResponseEntity<BaseResponse> getAllExpired(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "type", defaultValue = "", required = false) String type,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "createDate", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "desc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MedicalDto> medicals = medicalService.getAllExpired(keyword, type, pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải danh sách bệnh án đến hạn thanh lý thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Medicals", medicals.getContent());
                put("CurrentPage", medicals.getNumber());
                put("NumberOfItems", medicals.getNumberOfElements());
                put("TotalItems", medicals.getTotalElements());
                put("TotalPages", medicals.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @PostMapping("/patient/biosignal-statistical/{recordId}")
    public ResponseEntity<BaseResponse> biosignalStatistical(@PathVariable("recordId") String recordId,
            @RequestBody Map<String, String> request) {

        List<Map<String, Object>> result = medicalService.biosignalStatistical(recordId, request);
        BaseResponse response = new BaseResponse();
        response.setMessage("Thống kê dữ liệu sinh hiệu thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<>() {
            {
                put("Statistical", result);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
