package com.hospitalx.emr.services;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.common.MedicalResult;
import com.hospitalx.emr.common.MedicalType;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.models.dtos.MedicalDto;
import com.hospitalx.emr.models.entitys.Medical;
import com.hospitalx.emr.repositories.MedicalRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MedicalService implements IDAO<MedicalDto> {
    @Autowired
    private MedicalRepository medicalRepository;
    @Autowired
    private RecordService recordService;
    @Autowired
    private AuthenticationFacade authenticationFacade;
    @Autowired
    private HealthcareStaffService healthcareStaffService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private ModelMapper modelMapper;

    public void saveInpatient(MedicalDto medical) {
        inpatientValidate(medical);
        this.save(medical);
    }

    public void deleteAll(List<String> ids) {
        log.info("Delete all medicals");
        ids.stream().forEach(id -> this.delete(id));
        log.info("Delete all medicals success");
    }

    public Page<MedicalDto> getAllDelete(String keyword, String type, Pageable pageable) {
        log.info("Get all medicals delete");
        if (!type.equalsIgnoreCase(MedicalResult.DEATH.toString())
                && !type.equalsIgnoreCase(MedicalResult.ACCIDENT.toString())) {
            return medicalRepository.findAllByDueDate(keyword, new Date(), pageable)
                    .map(medical -> modelMapper.map(medical, MedicalDto.class));
        }

        return medicalRepository.findAllByDueDate(keyword, type, new Date(), pageable)
                .map(medical -> modelMapper.map(medical, MedicalDto.class));
    }

    public void lockMedical(String id) {
        log.info("Lock medical with ID: " + id);
        MedicalDto medical = this.get(id);
        if (medical.getLocked()) {
            log.error("Medical is locked with ID: " + id);
            throw new CustomException("Bệnh án đã được khóa!", HttpStatus.BAD_REQUEST.value());
        }

        if (medical.getTreatmentMethod() == null || medical.getTreatmentMethod().isEmpty()) {
            log.error("Medical treatment method is empty with ID: " + id);
            throw new CustomException("Phương pháp điều trị không được để trống!", HttpStatus.BAD_REQUEST.value());
        }
        if (medical.getDiagnosisDischarge() == null || medical.getDiagnosisDischarge().isEmpty()) {
            log.error("Medical diagnosis discharge is empty with ID: " + id);
            throw new CustomException("Chuẩn đoán ra viện không được để trống!", HttpStatus.BAD_REQUEST.value());
        }
        if (medical.getExamineOrgans() == null || medical.getExamineOrgans().isEmpty()) {
            log.error("Medical examine organs is empty with ID: " + id);
            throw new CustomException("Khám các cơ quan không được để trống!", HttpStatus.BAD_REQUEST.value());
        }
        if (medical.getResult() == null) {
            log.error("Medical result is empty with ID: " + id);
            throw new CustomException("Kết quả điều trị không được để trống!", HttpStatus.BAD_REQUEST.value());
        }
        if (medical.getDiagnosticImages() != null && !medical.getDiagnosticImages().isEmpty()) {
            if (medical.getSummary() == null || medical.getSummary().isEmpty()) {
                log.error("Medical summary is empty with ID: " + id);
                throw new CustomException("Tóm tắt kết quả chẩn đoán hình ảnh không được để trống!",
                        HttpStatus.BAD_REQUEST.value());
            }
        }
        String accountId = authenticationFacade.getAuthentication().getName();
        HealthcareStaffDto doctor = healthcareStaffService.getByAccountId(accountId);
        medical.setDoctorIdTreatment(doctor.getId());
        medicalValidate(medical);
        if (medical.getType() == MedicalType.INPATIENT) {
            if (medical.getSpecializedExamination() == null || medical.getSpecializedExamination().isEmpty()) {
                log.error("Medical specialized examination is empty");
                throw new CustomException("Khám chuyên khoa không được để trống!", HttpStatus.BAD_REQUEST.value());
            }
            if (medical.getDateDischarge() == null) {
                log.error("Medical date discharge is empty with ID: " + id);
                throw new CustomException("Thời gian ra viện không được để trống!", HttpStatus.BAD_REQUEST.value());
            }
        } else {
            medical.setDepartmentId(doctor.getDepartmentId());
        }
        Date duDate = null;
        int yearsToAdd = 10;
        if (medical.getResult() == MedicalResult.DEATH) {
            yearsToAdd = 20;
        } else if (medical.getResult() == MedicalResult.ACCIDENT) {
            yearsToAdd = 15;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.YEAR, yearsToAdd);
        duDate = calendar.getTime();
        medical.setLocked(true);
        medical.setSaveDate(new Date());
        medical.setDueDate(duDate);
        medicalRepository.save(modelMapper.map(medical, Medical.class));
        log.info("Lock medical success with ID: " + id);
    }

    public void markMedical(String id) {
        log.info("Change mark medical with ID: " + id);
        MedicalDto medical = this.get(id);
        String mark = medical.getMark().equalsIgnoreCase("YES") ? "NO" : "YES";
        medical.setMark(mark);
        medicalRepository.save(modelMapper.map(medical, Medical.class));
        log.info("Mark medical success with ID: " + id + " as " + mark);
    }

    @Override
    public MedicalDto save(MedicalDto t) {
        log.info("Save medical: " + t.toString());
        t.setId(null);
        recordService.get(t.getRecordId());
        medicalValidate(t);
        Medical medical = modelMapper.map(t, Medical.class);
        medical.setCreateDate(new Date());
        medical = medicalRepository.save(medical);
        log.info("Save medical success with ID: " + medical.getId());
        return modelMapper.map(medical, MedicalDto.class);
    }

    @Override
    public Page<MedicalDto> getAll(String keyword, String type, Pageable pageable) {
        String role = authenticationFacade.getAuthentication().getAuthorities().toArray()[0].toString();
        String doctorId = "";
        String[] parts = keyword.split("_", -1);
        if (parts[2].equalsIgnoreCase("false") && role.equals("ROLE_DOCTOR")) {
            String id = authenticationFacade.getAuthentication().getName();
            HealthcareStaffDto doctor = healthcareStaffService.getByAccountId(id);
            doctorId = doctor.getId();
        }
        log.info("Get all medicals");
        return medicalRepository.findAllByKeyword(parts[0], type, parts[1], doctorId, pageable)
                .map(medical -> modelMapper.map(medical, MedicalDto.class));
    }

    @Override
    public MedicalDto get(String id) {
        log.info("Get medical by ID: " + id);
        Medical medical = medicalRepository.findById(id).orElseThrow(() -> {
            log.error("Medical not found with ID: " + id);
            return new CustomException("Không tìm thấy bệnh án!", HttpStatus.NOT_FOUND.value());
        });
        return modelMapper.map(medical, MedicalDto.class);
    }

    @Override
    public void update(MedicalDto t) {
        log.info("Update medical with ID: " + t.getId());
        MedicalDto medical = this.get(t.getId());
        if (medical.getLocked()) {
            log.error("Medical is locked with ID: " + t.getId());
            throw new CustomException("Bệnh án đã khóa!", HttpStatus.BAD_REQUEST.value());
        }
        if (t.getDateDischarge() != null) {
            if (t.getDateDischarge().before(t.getDateAdmission())) {
                log.error("Medical date discharge is before date admission with ID: " + t.getId());
                throw new CustomException("Thời gian ra viện không được trước thời gian vào viện!",
                        HttpStatus.BAD_REQUEST.value());
            }
            t.setDaysTreatment(
                    (int) ((t.getDateDischarge().getTime() - t.getDateAdmission().getTime())
                            / (1000 * 60 * 60 * 24)) + 1);
        }
        medicalRepository.save(modelMapper.map(t, Medical.class));
        log.info("Update medical success with ID: " + t.getId());
    }

    @Override
    public void delete(String id) {
        MedicalDto medical = this.get(id);
        if (!medical.getLocked()) {
            log.error("Medical is not locked with ID: " + id);
            throw new CustomException("Bệnh án chưa được khóa!", HttpStatus.BAD_REQUEST.value());
        }
        Date now = new Date();
        if (!now.after(medical.getDueDate())) {
            log.error("Medical is not due date with ID: " + id);
            throw new CustomException("Bệnh án chưa đến hạn thanh lý!", HttpStatus.BAD_REQUEST.value());
        }
        log.info("Delete medical with ID: " + id);
        medicalRepository.deleteById(id);
        log.info("Delete medical success with ID: " + id);
    }

    private void medicalValidate(MedicalDto medical) {
        if (medical.getType() == MedicalType.INPATIENT) {
            if (medical.getDateAdmission() == null) {
                log.error("Medical date admission is empty");
                throw new CustomException("Thời gian vào viện không được để trống!", HttpStatus.BAD_REQUEST.value());
            }
            if (medical.getDepartmentAdmission() == null || medical.getDepartmentAdmission().isEmpty()) {
                log.error("Medical department admission is empty");
                throw new CustomException("Khoa vào viện không được để trống!", HttpStatus.BAD_REQUEST.value());
            }
            if (medical.getDiagnosisAdmission() == null || medical.getDiagnosisAdmission().isEmpty()) {
                log.error("Medical diagnosis admission is empty");
                throw new CustomException("Chuẩn đoán khi vào khoa điều trị không được để trống!",
                        HttpStatus.BAD_REQUEST.value());
            }
            if (medical.getPrognosis() == null || medical.getPrognosis().isEmpty()) {
                log.error("Medical prognosis is empty");
                throw new CustomException("Tiên lượng không được để trống!", HttpStatus.BAD_REQUEST.value());
            }
        } else {
            if (medical.getDate() == null) {
                log.error("Medical date is empty");
                throw new CustomException("Thời gian đến khám không được để trống!", HttpStatus.BAD_REQUEST.value());
            }
            if (medical.getInitialDiagnosis() == null || medical.getInitialDiagnosis().isEmpty()) {
                log.error("Medical initial diagnosis is empty");
                throw new CustomException("Chẩn đoán ban đầu không được để trống!", HttpStatus.BAD_REQUEST.value());
            }
        }
    }

    private void inpatientValidate(MedicalDto medical) {
        departmentService.get(medical.getDepartmentAdmission());
        if (medical.getDateTransfer() != null) {
            departmentService.get(medical.getDepartmentTransfer());
            if (medical.getDateTransfer().before(medical.getDateAdmission())) {
                log.error("Medical date transfer is before date admission");
                throw new CustomException("Thời gian chuyển khoa không được trước thời gian vào viện!",
                        HttpStatus.BAD_REQUEST.value());
            }
            if (medical.getDiagnosisTransfer() == null || medical.getDiagnosisTransfer().isEmpty()) {
                log.error("Medical diagnosis transfer is empty");
                throw new CustomException("Chuẩn đoán nơi chuyển đến không được để trống!",
                        HttpStatus.BAD_REQUEST.value());
            }
        }
    }
}
