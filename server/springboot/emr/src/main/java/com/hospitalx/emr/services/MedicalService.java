package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthManager;
import com.hospitalx.emr.common.MedicalResult;
import com.hospitalx.emr.common.MedicalType;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.AccountDto;
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
    private AccountService accountService;
    @Autowired
    private AuthManager authManager;
    @Autowired
    private HealthcareStaffService healthcareStaffService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private DiagnosticImageService diagnosticImageService;
    @Autowired
    private ModelMapper modelMapper;

    public List<Medical> getDashboard(Date startDate, Date endDate) {
        return medicalRepository.findAllByDateBetween(startDate, endDate);
    }

    public int totalMedical() {
        return medicalRepository.totalMedical();
    }

    public int totalMedicalNew() {
        return medicalRepository.totalMedicalNew();
    }

    public int totalMedicalLocked() {
        return medicalRepository.totalMedicalLocked();
    }

    public int totalMedicalExpired() {
        return medicalRepository.totalMedicalExpired(new Date());
    }

    public List<Map<String, Object>> biosignalStatistical(String recordId, Map<String, String> request) {
        log.info("Get biosignal statistical");
        // Check record exist
        String accountId = authManager.getAuthentication().getName();
        AccountDto account = accountService.get(accountId);
        if (!account.getRecords().contains(recordId)) {
            log.error("Record not found with ID: " + recordId);
            throw new CustomException("Hồ sơ không tồn tại!", HttpStatus.NOT_FOUND.value());
        }
        Date startDate = convertDate(request.get("StartDate"));
        Date endDate = convertDate(request.get("EndDate"));
        if (startDate.after(endDate)) {
            log.error("Start date is after end date");
            throw new CustomException("Ngày bắt đầu không thể sau ngày kết thúc!", HttpStatus.BAD_REQUEST.value());
        }
        List<Medical> medicals = medicalRepository.findAllByRecordIdAndDateBetween(recordId, startDate, endDate);
        List<Map<String, Object>> data = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();
        medicals.stream().forEach((medical -> {
            calendar.setTime(medical.getCreatedAt());
            Map<String, Object> item = new HashMap<>();
            item.put("Date", (calendar.get(Calendar.YEAR) + "-" + (calendar.get(Calendar.MONTH) + 1) + "-"
                    + calendar.get(Calendar.DAY_OF_MONTH)));
            item.put("HeartRate", Double.parseDouble(medical.getBiosignal().getHeartRate()));
            item.put("Temperature", Double.parseDouble(medical.getBiosignal().getTemperature()));
            item.put("BloodPressure", Double.parseDouble(medical.getBiosignal().getBloodPressure()));
            item.put("RespiratoryRate", Double.parseDouble(medical.getBiosignal().getRespiratoryRate()));
            item.put("Weight", Double.parseDouble(medical.getBiosignal().getWeight()));
            data.add(item);
        }));
        return data;
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

        if (medical.getSummary() == null || medical.getSummary().isEmpty()) {
            log.error("Medical summary is empty with ID: " + id);
            throw new CustomException("Tóm tắt kết quả chẩn đoán hình ảnh không được để trống!",
                    HttpStatus.BAD_REQUEST.value());
        }
        String accountId = authManager.getAuthentication().getName();
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
        if (t.getType().equals(MedicalType.INPATIENT)) {
            inpatientValidate(t);
        }
        t.setId(null);
        recordService.get(t.getRecordId());
        medicalValidate(t);
        Medical medical = modelMapper.map(t, Medical.class);
        medical.setCreatedAt(new Date());
        medical = medicalRepository.save(medical);
        log.info("Save medical success with ID: " + medical.getId());
        return modelMapper.map(medical, MedicalDto.class);
    }

    @Override
    public Page<MedicalDto> getAll(String keyword, String type, Pageable pageable) {
        String role = authManager.getAuthentication().getAuthorities().toArray()[0].toString();
        String doctorId = "";
        String[] parts = keyword.split("_", -1);
        parts[1] = parts[1].isEmpty() ? parts[1] : "^" + parts[1] + "$";
        if (parts[2].equalsIgnoreCase("false") && role.equals("ROLE_DOCTOR")) {
            String id = authManager.getAuthentication().getName();
            HealthcareStaffDto doctor = healthcareStaffService.getByAccountId(id);
            doctorId = "^" + doctor.getId() + "$";
        }
        log.info("Get all medicals");
        if (role.equals("ROLE_PATIENT"))
            return medicalRepository.findAllByKeyword(parts[0], parts[1], pageable)
                    .map(medical -> this.addDepartmentWithDiaImage(modelMapper.map(medical, MedicalDto.class)));

        return medicalRepository.findAllByKeyword(parts[0], type, parts[1], doctorId, pageable)
                .map(medical -> this.addDepartmentWithDiaImage(modelMapper.map(medical, MedicalDto.class)));
    }

    @Override
    public MedicalDto get(String id) {
        log.info("Get medical by ID: " + id);
        Medical medical = medicalRepository.findById(id).orElseThrow(() -> {
            log.error("Medical not found with ID: " + id);
            return new CustomException("Không tìm thấy bệnh án!", HttpStatus.NOT_FOUND.value());
        });
        return this.addDepartmentWithDiaImage(modelMapper.map(medical, MedicalDto.class));
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

    private Date convertDate(String date) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        try {
            return formatter.parse(date);
        } catch (Exception e) {
            log.error("Convert date error: " + e.getMessage());
            throw new CustomException("Lỗi chuyển đổi ngày tháng!", HttpStatus.BAD_REQUEST.value());
        }
    }

    private MedicalDto addDepartmentWithDiaImage(MedicalDto medical) {
        if (medical.getDoctorIdTreatment() != null && !medical.getDoctorIdTreatment().equals("")
                && medical.getType() == MedicalType.OUTPATIENT) {
            HealthcareStaffDto doctor = healthcareStaffService.get(medical.getDoctorIdTreatment());
            String departmentId = doctor.getDepartmentId();
            medical.setDepartmentId(departmentId);
        }
        diagnosticImageService.getAll(medical.getId(), "", Pageable.unpaged()).stream().forEach(diaImageDto -> {
            medical.getDiagnosisImage().add(diaImageDto);
        });
        return medical;
    }
}
