package com.hospitalx.emr.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.services.CloudinaryService;

@RestController
@RequestMapping("/api")
public class CloudinaryController {
    @Autowired
    private CloudinaryService cloudinaryService;

    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    @DeleteMapping("/doctor/delete-image/{id}")
    public ResponseEntity<BaseResponse> delete(@PathVariable("id") String id) {
        cloudinaryService.delete(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa ảnh thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
