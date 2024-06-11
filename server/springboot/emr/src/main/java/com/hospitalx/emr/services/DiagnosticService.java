package com.hospitalx.emr.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hospitalx.emr.component.AuthManager;
import com.hospitalx.emr.models.dtos.DiagnosticImageDto;
import com.hospitalx.emr.models.entitys.DiagnosticImage;
import com.hospitalx.emr.repositories.DiagnosticImageRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DiagnosticService {
    @Autowired
    private DiagnosticImageRepository diagnosticImageRepository;
    @Autowired
    private AuthManager authManager;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private HealthcareStaffService healthcareStaffService;
    // private String url = "http://localhost:5000"; // url nomal
    private String url = "http://PythonAPI:5000"; // url docker

    public void lock(String medicalId) {
        log.info("Lock diagnostic image with medicalId: " + medicalId);
        diagnosticImageRepository.findByMedicalId(medicalId).stream().forEach(diagnosticImage -> {
            if (!diagnosticImage.getLocked()) {
                diagnosticImage.setLocked(true);
                diagnosticImageRepository.save(diagnosticImage);
            }
        });
        log.info("Lock diagnostic image success with medicalId: " + medicalId);
    }

    public Object medicalConsultation(List<String> symptoms) {
        log.info("Run medical consultation");
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, List<String>> body = new HashMap<>() {
            {
                put("symptoms", symptoms);
            }
        };
        HttpEntity<Map<String, List<String>>> request = new HttpEntity<>(body, headers);
        log.info("Request: " + request.toString());
        return restTemplate.postForObject(url + "/symptoms/predict", request, Object.class);
    }

    public Object diagnosisImage(String urlImage) {
        log.info("Run classification image medical");
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        Map<String, String> body = new HashMap<>() {
            {
                put("imageURL", urlImage);
            }
        };
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        log.info("Request: " + request.toString());

        return restTemplate.postForObject(url + "/image/predict", request, Object.class);
    }

    public DiagnosticImageDto save(DiagnosticImageDto t) {
        log.info("Save diagnostic image");
        String accountId = authManager.getAuthentication().getName();
        t.setDoctorIdPerform(healthcareStaffService.getByAccountId(accountId).getId());
        return modelMapper.map(diagnosticImageRepository.save(modelMapper.map(t, DiagnosticImage.class)),
                DiagnosticImageDto.class);
    }

    public Page<DiagnosticImageDto> getAll(String keyword, String type, Pageable pageable) {
        log.info("Get all diagnostic image");
        return diagnosticImageRepository.findByMedicalId(keyword, pageable)
                .map(diagnosticImage -> modelMapper.map(diagnosticImage, DiagnosticImageDto.class));
    }

    public void delete(String id) {
        log.info("Delete diagnostic image with ID: " + id);
        diagnosticImageRepository.deleteById(id);
        log.info("Delete diagnostic image success with ID: " + id);
    }

}
