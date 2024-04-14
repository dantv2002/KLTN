package com.hospitalx.emr.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.configs.AppConfig;
import com.hospitalx.emr.models.dtos.AccountDto;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TokenService {
    @Autowired
    private AppConfig appConfig;

    @Value("${app.jwt.expiresTime}")
    private long expiresTime;

    public String createToken(AccountDto accountdDto) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(expiresTime, ChronoUnit.DAYS);
        String authorities = accountdDto.getRole();

        log.debug("Account ID: {}", accountdDto.getId());
        log.debug("Authorities: {}", authorities);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(accountdDto.getId())
                .claim("authorities", authorities)
                .build();

        return this.jwtEncoder().encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    private JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(appConfig.getPublicKey())
                .privateKey(appConfig.getPrivateKey())
                .build();
        JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwkSource);
    }
}
