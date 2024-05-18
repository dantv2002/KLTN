package com.hospitalx.emr.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DiagnosticService {
    public Object medicalConsultation(String text) {
        log.info("Run medical consultation");
        String url = "http://localhost:5000/text/predict"; // url nomal
        // String url = "http://PythonAPI:5000/text/predict"; // url docker
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, String> body = new HashMap<>() {
            {
                put("text", text);
            }
        };
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        log.info("Request: " + request.toString());
        return restTemplate.postForObject(url, request, Object.class);
    }
}
