package com.hospitalx.emr.configs;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@Data
public class AppConfig {
    @Value("${app.jwt.rsa.public-key}")
    private RSAPublicKey publicKey;
    @Value("${app.jwt.rsa.private-key}")
    private RSAPrivateKey privateKey;
    @Value("${app.cookie.expiresTime}")
    private int expiresTime;
    @Value("${app.imageDefault}")
    private String imageDefault;
    @Value("${client.url}")
    private String clientUrl;
}
