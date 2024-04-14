package com.hospitalx.emr.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.models.dtos.AccountDto;
import com.hospitalx.emr.models.dtos.VerificationCodeDto;
import com.hospitalx.emr.services.AccountService;
import com.hospitalx.emr.services.TokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.configs.AppConfig;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class AuthController {
    @Autowired
    private AppConfig appConfig;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TokenService tokenService;

    // API register account local
    @PostMapping("/auth/register")
    public ResponseEntity<BaseResponse> registerAccount(@RequestBody @Valid AccountDto accountDto) {
        BaseResponse response = new BaseResponse();
        log.debug("message", accountDto);
        AccountDto account = accountService.registerAccount(accountDto);
        response.setMessage("Verify code has been sent to email: " + accountDto.getEmail());
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<>() {
            {
                put("Account", account);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // API verify account register local
    @PostMapping("/auth/register/{id}")
    public ResponseEntity<BaseResponse> verifyAccount(@RequestBody @Valid VerificationCodeDto verificationCodeDto,
            @PathVariable("id") String id) {
        BaseResponse response = new BaseResponse();
        accountService.verifyAccount(id, verificationCodeDto.getCode());
        response.setMessage("Account has been verified");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // API reset password account local
    @PutMapping("/auth/reset-password")
    public ResponseEntity<BaseResponse> resetPassword(@RequestBody @Valid AccountDto accountDto) {
        AccountDto account = accountService.resetPassword(accountDto);

        BaseResponse response = new BaseResponse();
        response.setMessage("Verify code has been sent to email: " + accountDto.getEmail());
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<>() {
            {
                put("Account", account);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // API verify reset password account local
    @PostMapping("/auth/reset-password/{id}")
    public ResponseEntity<BaseResponse> verifyResetPassword(@RequestBody @Valid VerificationCodeDto verificationCodeDto,
            @PathVariable("id") String id) {
        BaseResponse response = new BaseResponse();
        accountService.verifyResetPassword(id, verificationCodeDto.getCode());
        response.setMessage("Reset password success");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // API login with account local
    @PostMapping("/auth/login")
    public ResponseEntity<BaseResponse> login(@RequestBody Map<String, String> login,
            HttpServletResponse response) {

        AccountDto account = accountService.loginAccount(login.get("Email"), login.get("Password"));

        this.setCookie(response, "Token", tokenService.createToken(account), appConfig.getExpiresTime(), true);
        this.setCookie(response, "FullName", account.getFullName(), appConfig.getExpiresTime(), false);
        this.setCookie(response, "Email", account.getEmail(), appConfig.getExpiresTime(), false);
        this.setCookie(response, "Role", account.getRole(), appConfig.getExpiresTime(), false);

        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setMessage("Login success");
        baseResponse.setStatus(HttpStatus.OK.value());
        baseResponse.setData(null);

        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    // API logout
    @GetMapping("/logout")
    public ResponseEntity<BaseResponse> logout(HttpServletResponse response) {

        this.setCookie(response, "Token", null, 0, true);
        this.setCookie(response, "FullName", null, 0, false);
        this.setCookie(response, "Email", null, 0, false);
        this.setCookie(response, "Role", null, 0, false);

        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setMessage("Logout success");
        baseResponse.setStatus(HttpStatus.OK.value());
        baseResponse.setData(null);

        return ResponseEntity.status(baseResponse.getStatus()).body(baseResponse);
    }

    private void setCookie(HttpServletResponse response, String name, String value, int maxAge, boolean httpOnly) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(httpOnly);
        cookie.setMaxAge(maxAge * 24 * 60 * 60);
        response.addCookie(cookie);
    }
}
