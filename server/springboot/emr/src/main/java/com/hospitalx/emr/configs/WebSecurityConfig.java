package com.hospitalx.emr.configs;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.WebUtils;

import com.hospitalx.emr.component.DelegatedAuthenticationEntryPoint;
import com.hospitalx.emr.component.OAuth2AuthenticationFailureHandler;
import com.hospitalx.emr.component.OAuth2LoginSuccessHandler;
import com.hospitalx.emr.utils.CustomAuthenticationConverter;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity()
public class WebSecurityConfig {
    @Value("${client.url}")
    private String clientUrl;

    @Autowired
    private AppConfig appConfig;

    @Autowired
    private OAuth2LoginSuccessHandler successHandler;
    @Autowired
    private OAuth2AuthenticationFailureHandler failureHandler;

    @Autowired
    private DelegatedAuthenticationEntryPoint delegatedAuthenticationEntryPoint;

    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowedOrigins(Arrays.asList(clientUrl));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/oauth2/**", "/api/auth/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .oauth2Login(auth -> {
                    auth.authorizationEndpoint(point -> point.baseUri(
                            "/oauth2/authorize"));
                    auth.redirectionEndpoint(redirect -> redirect.baseUri("/oauth2/callback/*"));
                    auth.successHandler(successHandler);
                    auth.failureHandler(failureHandler);
                })
                .oauth2ResourceServer(oauth2 -> {
                    oauth2.bearerTokenResolver(req -> this.getTokenFromCookie(req));
                    oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()));
                })
                .exceptionHandling(handler -> handler.authenticationEntryPoint(delegatedAuthenticationEntryPoint))
                .build();
    }

    private Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(new CustomAuthenticationConverter());
        return jwtConverter;
    }

    private String getTokenFromCookie(HttpServletRequest req) {
        Cookie cookie = WebUtils.getCookie(req, "Token");
        return (cookie != null) ? cookie.getValue() : null;
    }

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(appConfig.getPublicKey()).build();
    }

}
