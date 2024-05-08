package com.hospitalx.emr.controllers;

import java.util.HashMap;
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

import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.models.dtos.AccountDto;
import com.hospitalx.emr.models.dtos.UpdatePasswordDto;
import com.hospitalx.emr.services.AccountService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class AccountController {
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuthenticationFacade authenticationFacade;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/admin/account/new/{id}")
    public ResponseEntity<BaseResponse> create(@RequestBody @Valid AccountDto accountDto,
            @PathVariable("id") String id) {
        accountService.adminCreateAccount(accountDto, id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tạo tài khoản thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/accounts")
    public ResponseEntity<BaseResponse> getAll(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "type", defaultValue = "", required = false) String type,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<AccountDto> data = accountService.getAll(keyword, type, pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải danh sách tài khoản thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Accounts", data.getContent());
                put("CurrentPage", data.getNumber());
                put("NumberOfItems", data.getNumberOfElements());
                put("TotalItems", data.getTotalElements());
                put("TotalPages", data.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/account/set-active/{id}")
    public ResponseEntity<BaseResponse> setActive(@PathVariable("id") String id,
            @RequestBody Map<String, Boolean> active) {
        accountService.setActive(id, active.get("Active"));
        BaseResponse response = new BaseResponse();
        response.setMessage(active.get("Active") ? "Mở tài khoản thành công" : "Đóng tài khoản thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/account/reset-password")
    public ResponseEntity<BaseResponse> resetPassword(@RequestBody @Valid AccountDto accountDto) {
        accountService.adminResetPassword(accountDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Cấp lại mật khẩu thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/account/{id}")
    public ResponseEntity<BaseResponse> delete(@PathVariable("id") String id) {
        accountService.adminDeleteAccount(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Xóa tài khoản thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // API update password
    @PutMapping("/update-password")
    public ResponseEntity<BaseResponse> updatePassword(@RequestBody @Valid UpdatePasswordDto updatePasswordDto) {
        accountService.updatePassword(updatePasswordDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Đổi mật khẩu thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // API logout
    @GetMapping("/logout")
    public ResponseEntity<BaseResponse> logout(HttpServletResponse response) {
        String id = authenticationFacade.getAuthentication().getName();
        AuthController.setCookie(response, "Token", null, 0, true);
        AuthController.setCookie(response, "FullName", null, 0, false);
        AuthController.setCookie(response, "Email", null, 0, false);
        AuthController.setCookie(response, "Role", null, 0, false);

        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setMessage("Đăng xuất thành công");
        baseResponse.setStatus(HttpStatus.OK.value());
        baseResponse.setData(null);
        log.info("Account: " + id + " logged out");
        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

}
