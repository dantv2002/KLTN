package com.hospitalx.emr.controllers;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
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
import com.hospitalx.emr.models.dtos.ScheduleDto;
import com.hospitalx.emr.services.ScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@Validated
public class ScheduleController {
    @Autowired
    private ScheduleService scheduleService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/admin/schedule/new/{id}")
    public ResponseEntity<BaseResponse> create(@PathVariable("id") String id,
            @RequestBody List<@Valid ScheduleDto> scheduleDtoList) {
        scheduleService.createSchedule(id, scheduleDtoList);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tạo lịch khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PATIENT')")
    @GetMapping({ "/admin/schedules/{id}", "/patient/schedules/{id}" })
    public ResponseEntity<BaseResponse> getAll(
            @PathVariable("id") String id,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ScheduleDto> data = scheduleService.getAll(id, "", pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải thông tin lịch khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Schedules", data.getContent());
                put("CurrentPage", data.getNumber());
                put("NumberOfItems", data.getNumberOfElements());
                put("TotalItems", data.getTotalElements());
                put("TotalPages", data.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @GetMapping("/patient/schedule/get-time/{id}/{date}")
    public ResponseEntity<BaseResponse> get(@PathVariable("id") String id, @PathVariable("date") String date) {
        List<ScheduleDto> scheduleDto = scheduleService.getTime(id, date);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải buổi khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Record", scheduleDto);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/schedules/{id}")
    public ResponseEntity<BaseResponse> update(@PathVariable("id") String id,
            @RequestBody List<@Valid ScheduleDto> scheduleDtoList) {
        scheduleService.updateSchedule(id, scheduleDtoList);
        BaseResponse response = new BaseResponse();
        response.setMessage("Cập nhật lịch khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/schedule/{idDoctor}/{idSchedule}")
    public ResponseEntity<BaseResponse> delete(@PathVariable("idDoctor") String idDoctor,
            @PathVariable("idSchedule") String idSchedule) {
        scheduleService.deleteSchedule(idDoctor, idSchedule);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa lịch khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Register clinic
    @PreAuthorize("hasRole('ROLE_RECEPTIONIST')")
    @GetMapping("/receptionist/register-clinic/{id}")
    public ResponseEntity<BaseResponse> registerClinic(@PathVariable("id") String id) {
        ScheduleDto result = scheduleService.registerClinic(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Đăng ký phòng khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Schedule", result);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_RECEPTIONIST')")
    @GetMapping("/receptionist/schedules/{id}")
    public ResponseEntity<BaseResponse> getScheduleDepartment(@PathVariable("id") String id) {
        List<ScheduleDto> scheduleDto = scheduleService.getSchedule(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải thông tin lịch khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Schedules", scheduleDto);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Call next patient
    @PreAuthorize("hasRole('ROLE_NURSE')")
    @GetMapping("/nurse/call-next")
    public ResponseEntity<BaseResponse> getNumberWaiting(
            @RequestParam(name = "numberClinic", required = true) String numberClinic,
            @RequestParam(name = "location", required = true) String location) {
        int result = scheduleService.callNext(numberClinic, location);
        BaseResponse response = new BaseResponse();
        response.setMessage("Gọi bệnh nhân tiếp theo thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Number", result);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
