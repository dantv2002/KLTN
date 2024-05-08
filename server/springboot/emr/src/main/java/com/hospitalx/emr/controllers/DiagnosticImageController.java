package com.hospitalx.emr.controllers;

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
import com.hospitalx.emr.services.DiagnosticImageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class DiagnosticImageController {
    @Autowired
    private DiagnosticImageService diagnosticImageService;

    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    @PostMapping("/diagnostic-image/run")
    public ResponseEntity<BaseResponse> predict(@RequestBody Map<String, String> request) {
        String urlImage = request.get("Image");
        BaseResponse response = new BaseResponse();

        Object result = diagnosticImageService.diagnosisImage(urlImage);
        //
        response.setMessage("Chạy hỗ trợ chẩn đoán hình ảnh thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(result);
        return ResponseEntity.status(200).body(response);
    }

    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    @PostMapping("/diagnostic-image/save")
    public ResponseEntity<BaseResponse> save(@RequestBody @Valid DiagnosticImageDto body) {
        diagnosticImageService.save(body);
        BaseResponse response = new BaseResponse();
        response.setMessage("Đã lưu kết quả chẩn đoán hình ảnh thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(200).body(response);
    }
}
