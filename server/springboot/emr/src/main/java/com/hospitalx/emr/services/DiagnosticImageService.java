package com.hospitalx.emr.services;

import java.util.HashMap;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.models.dtos.DiagnosticImageDto;
import com.hospitalx.emr.models.entitys.DiagnosticImage;
import com.hospitalx.emr.repositories.DiagnosticImageRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DiagnosticImageService implements IDAO<DiagnosticImageDto> {
    @Autowired
    private DiagnosticImageRepository diagnosticImageRepository;
    @Autowired
    private AuthenticationFacade authenticationFacade;
    @Autowired
    private ModelMapper modelMapper;

    public void saveResult(String medicalId, DiagnosticImageDto result){
        log.info("Save result diagnostic image");
        result.setMedicalId(medicalId);
        this.save(result);
        log.info("Save result diagnostic image success");
    }

    public Object diagnosisImage(String urlImage) {
        log.info("Run classification image medical");
        String url = "http://localhost:5000/image/predict"; // url nomal
        // String url = "http://PythonAPI:5000/image/predict"; // url docker
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
        return restTemplate.postForObject(url, request, Object.class);
    }

    @Override
    public DiagnosticImageDto save(DiagnosticImageDto t) {
        log.info("Save diagnostic image");
        String doctorId = authenticationFacade.getAuthentication().getName();
        t.setDoctorIdPerform(doctorId);
        return modelMapper.map(diagnosticImageRepository.save(modelMapper.map(t, DiagnosticImage.class)),
                DiagnosticImageDto.class);
    }

    public boolean checkExistByMedicalId(String id) {
        return diagnosticImageRepository.existsByMedicalId(id);
    }

    @Override
    public Page<DiagnosticImageDto> getAll(String keyword, String type, Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAll'");
    }

    @Override
    public DiagnosticImageDto get(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'get'");
    }

    @Override
    public void update(DiagnosticImageDto t) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public void delete(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
