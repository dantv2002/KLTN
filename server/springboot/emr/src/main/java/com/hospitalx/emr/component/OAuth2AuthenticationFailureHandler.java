
package com.hospitalx.emr.component;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.hospitalx.emr.configs.AppConfig;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private AppConfig appConfig;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        log.error("OAuth2 authentication failed: {} ", exception.getMessage());
        String targetUrl = appConfig.getClientUrl() + "/oauth2/redirect";

        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("status", HttpStatus.UNAUTHORIZED.value())
                .queryParam("message", "Authentication failed! Please try again!")
                .build().toUriString();
        response.sendRedirect(targetUrl);
    }
}