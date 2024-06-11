package com.hospitalx.emr.component;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.hospitalx.emr.common.AuthProvider;
import com.hospitalx.emr.models.dtos.AccountDto;
import com.hospitalx.emr.services.AccountService;
import com.hospitalx.emr.services.TokenService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private AccountService accountService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private Encoder encoder;

    private AccountDto accountdDto = null;
    private String message = "Thành công";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws ServletException, IOException {
        String targetUrl = "/emr/api/oauth2/redirect";
        DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();

        Map<String, Object> attributes = principal.getAttributes();
        String name = attributes.getOrDefault("name", "").toString();
        String email = attributes.getOrDefault("email", "").toString();
        log.info("Login account: " + email + " - Auth provider: " + AuthProvider.GOOGLE);
        accountService.get(email, AuthProvider.GOOGLE).ifPresentOrElse(accDto -> {
            if (accDto.getDeleted() || !accDto.getActived()) {
                if (accDto.getDeleted()) {
                    accountService.delete(accDto.getId());
                    message = "Dữ liệu của tài khoản đã bị xóa";
                    this.createAccount(name, email);
                } else {
                    message = "Tài khoản đã bị khóa";
                }
            } else {
                this.accountdDto = accDto;
            }
        }, () -> {
            this.createAccount(name, email);
        });
        message = encoder.encode(message);
        if (accountdDto != null) {
            targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                    .queryParam("status", HttpStatus.OK.value())
                    .queryParam("message", message)
                    .queryParam("token", tokenService.createToken(accountdDto))
                    .queryParam("fullname", encoder.encode(accountdDto.getFullName()))
                    .queryParam("email", accountdDto.getEmail())
                    .queryParam("role", accountdDto.getRole())
                    .build().toUriString();
            log.info("Login account success: " + email);
        } else {
            targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                    .queryParam("status", HttpStatus.UNAUTHORIZED.value())
                    .queryParam("message", message)
                    .build().toUriString();
            log.error("Login account failed: " + email);
        }
        response.sendRedirect(targetUrl);
    }

    private void createAccount(String name, String email) {
        accountdDto = new AccountDto();
        accountdDto.setFullName(name);
        accountdDto.setEmail(email);
        accountdDto.setAuthProvider(AuthProvider.GOOGLE);
        accountdDto = accountService.save(accountdDto);
    }
}
