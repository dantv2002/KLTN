package com.hospitalx.emr.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.models.dtos.DiagnosticImageDto;
import com.hospitalx.emr.services.DiagnosticService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class DiagnosticController {
    @Autowired
    private DiagnosticService diagnosticService;

    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    @PostMapping("/doctor/diagnostic-image/run")
    public ResponseEntity<BaseResponse> predict(@RequestBody Map<String, String> request) {
        String urlImage = request.get("Image");
        BaseResponse response = new BaseResponse();

        Object result = diagnosticService.diagnosisImage(urlImage);
        //
        response.setMessage("Chạy hỗ trợ chẩn đoán hình ảnh thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(result);
        return ResponseEntity.status(200).body(response);
    }

    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    @PostMapping("/doctor/diagnostic-image/save")
    public ResponseEntity<BaseResponse> create(@RequestBody @Valid DiagnosticImageDto body) {
        diagnosticService.save(body);
        BaseResponse response = new BaseResponse();
        response.setMessage("Đã lưu kết quả chẩn đoán hình ảnh thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(200).body(response);
    }

    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @PostMapping("/patient/medical-consultation")
    public ResponseEntity<BaseResponse> medicalConsultation(@RequestBody Map<String, List<String>> request) {
        List<String> symptoms = request.get("Symptoms");
        Object result = diagnosticService.medicalConsultation(symptoms);
        BaseResponse response = new BaseResponse();
        response.setMessage("Chạy tư vấn khám bệnh thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(result);
        return ResponseEntity.status(200).body(response);
    }
}
