package com.hospitalx.emr.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.services.DashboardService;

@RestController
@RequestMapping("/api/admin")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/dashboard")
    public ResponseEntity<BaseResponse> getDashboard(@RequestBody Map<String, String> request) {
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải dữ liệu thống kê thành công");
        response.setStatus(200);
        response.setData(dashboardService.getDashboard(request));
        return ResponseEntity.ok(response);
    }

}
