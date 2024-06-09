package com.hospitalx.emr.services;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthManager;
import com.hospitalx.emr.common.NurseLevel;
import com.hospitalx.emr.common.StaffType;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.models.entitys.HealthcareStaff;
import com.hospitalx.emr.repositories.HealthcareStaffRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class HealthcareStaffService {
    @Autowired
    private HealthcareStaffRepository healthcareStaffRepository;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuthManager authManager;

    public HealthcareStaffDto getByAccountId(String accountId) {
        log.info("Get healthcare staff by account ID: " + accountId);
        HealthcareStaff entity = healthcareStaffRepository.findByAccountId(accountId);
        if (entity == null) {
            log.error("Healthcare staff is not exists");
            throw new CustomException("Không tìm thấy nhân viên y tế", HttpStatus.NOT_FOUND.value());
        }
        log.info("Get healthcare staff success");
        return modelMapper.map(entity, HealthcareStaffDto.class);
    }

    public List<HealthcareStaffDto> getAllByDepartmentId(String departmentId) {
        log.info("Get all healthcare staffs by department ID: " + departmentId);
        List<HealthcareStaff> entities = healthcareStaffRepository.findAllByDepartmentId(departmentId);
        log.info("Get all healthcare staffs success with total staffs: " + entities.size());
        return entities.stream().map(entity -> modelMapper.map(entity, HealthcareStaffDto.class)).toList();
    }

    // Check healthcare staff exists account
    public HealthcareStaffDto checkExistsAccount(String id) {
        HealthcareStaffDto healthcareStaffDto = this.get(id, true);
        if (healthcareStaffDto.getAccountId() != null) {
            log.error("Healthcare staff is already exists account");
            throw new CustomException("Nhân viên y tế này đã có tài khoản", HttpStatus.BAD_REQUEST.value());
        }
        return healthcareStaffDto;
    }

    // Get all healthcare staffs for creating new account
    public Page<HealthcareStaffDto> getAllNotAccount(String keyword, String type, Pageable pageable) {
        type = type.toLowerCase();
        if (type != null && !type.isEmpty() && !type.equals("doctor") && !type.equals("nurse")
                && !type.equals("receptionist")) {
            log.error("Staff type is invalid");
            throw new CustomException("Loại nhân viên không hợp lệ", HttpStatus.BAD_REQUEST.value());
        }
        log.info("Get all healthcare staffs for creating new account with type: " + type);
        StaffType staffType = null;
        if (type.equals("doctor")) {
            staffType = StaffType.DOCTOR;
        } else if (type.equals("nurse")) {
            staffType = StaffType.NURSE;
        } else if (type.equals("receptionist")) {
            staffType = StaffType.RECEPTIONIST;
        }
        Page<HealthcareStaff> entities = null;
        if (staffType == null) {
            entities = healthcareStaffRepository.findByFullNameContainingIgnoreCaseAndAccountId(keyword, pageable);
        } else {
            entities = healthcareStaffRepository.findByAllStaffTypeAndFullNameContainingIgnoreCaseAndAccountId(
                    staffType, keyword,
                    pageable);
        }
        return entities.map(entity -> {
            return modelMapper.map(entity, HealthcareStaffDto.class);
        });
    }

    public HealthcareStaffDto save(HealthcareStaffDto t) {
        // validate
        validateStaff(t);
        log.info("Save healthcare staff: " + t.toString());
        if (healthcareStaffRepository.findByIdentityCard(t.getIdentityCard()).isPresent()) {
            log.error("Identity card is already exists");
            throw new CustomException("Nhân viên y tế này đã tồn tại", HttpStatus.BAD_REQUEST.value());
        }
        departmentService.get(t.getDepartmentId(), true); // check department exists
        HealthcareStaff entity = modelMapper.map(t, HealthcareStaff.class);
        entity = healthcareStaffRepository.save(entity);
        log.info("Save healthcare staff success with ID: " + entity.getId());
        return modelMapper.map(entity, HealthcareStaffDto.class);
    }

    public Page<HealthcareStaffDto> getAll(String keyword, String type, Pageable pageable) {
        String[] parts = keyword.split("_", -1);
        String role = authManager.getAuthentication().getAuthorities().toArray()[0].toString();
        if (role.equals(("ROLE_PATIENT"))) {
            List<String> idDepartments = null;
            if (parts[2].isEmpty()) {
                idDepartments = departmentService.getAll("", "", Pageable.unpaged()).stream()
                .map(department -> department.getId()).toList();
            }else{
                idDepartments = new ArrayList<String>();
                idDepartments.add(parts[2]);
            }
            Page<HealthcareStaff> entities = healthcareStaffRepository.findByDoctorForPatient(StaffType.DOCTOR,
                    parts[0], parts[1], idDepartments,
                    parts[3], pageable);
            return entities.map(entity -> {
                HealthcareStaffDto healthcareStaffDto = modelMapper.map(entity, HealthcareStaffDto.class);
                String departmentName = departmentService.get(healthcareStaffDto.getDepartmentId(), false)
                        .getNameDepartment();
                healthcareStaffDto.setDepartmentName(departmentName);
                return healthcareStaffDto;
            });
        }
        type = type.toLowerCase();
        if (type != null && !type.isEmpty() && !type.equals("doctor") && !type.equals("nurse")
                && !type.equals("receptionist")) {
            log.error("Staff type is invalid");
            throw new CustomException("Loại nhân viên không hợp lệ", HttpStatus.BAD_REQUEST.value());
        }
        log.info("Get all healthcare staffs with type: " + type);
        Page<HealthcareStaff> entities = null;
        if (type.equals("doctor")) {
            entities = healthcareStaffRepository.findByDoctor(StaffType.DOCTOR, parts[0], parts[1], parts[2],
                    parts[3], pageable);
        } else if (type.equals("nurse")) {
            entities = healthcareStaffRepository.findByStaffTypeAndFullNameContainingIgnoreCase(StaffType.NURSE,
                    parts[0], pageable);
        } else if (type.equals("receptionist")) {
            entities = healthcareStaffRepository.findByStaffTypeAndFullNameContainingIgnoreCase(StaffType.RECEPTIONIST,
                    parts[0], pageable);
        } else {
            entities = healthcareStaffRepository.findByFullNameContainingIgnoreCase(parts[0], pageable);
        }
        log.info("Get all healthcare staffs success with total staffs: " + entities.getTotalElements());
        return entities.map(entity -> {
            HealthcareStaffDto healthcareStaffDto = modelMapper.map(entity, HealthcareStaffDto.class);
            String departmentName = departmentService.get(healthcareStaffDto.getDepartmentId(), false)
                    .getNameDepartment();
            healthcareStaffDto.setDepartmentName(departmentName);
            return healthcareStaffDto;
        });
    }

    public HealthcareStaffDto get(String id, Boolean checkDeleted) {
        log.info("Get healthcare staff with ID: " + id);
        HealthcareStaff entity = healthcareStaffRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy nhân viên y tế", HttpStatus.NOT_FOUND.value()));
        log.info("Get healthcare staff success");
        if (checkDeleted && entity.getDeleted()) {
            log.error("Healthcare staff is deleted");
            throw new CustomException("Không tìm thấy nhân viên y tế", HttpStatus.NOT_FOUND.value());
        }
        return modelMapper.map(entity, HealthcareStaffDto.class);
    }

    public void update(HealthcareStaffDto t) {
        get(t.getId(), true); // check staff exists
        // validate
        validateStaff(t);
        log.info("Update healthcare staff: " + t.toString());
        departmentService.get(t.getDepartmentId(), true); // check department exists
        HealthcareStaff entity = modelMapper.map(t, HealthcareStaff.class);
        entity = healthcareStaffRepository.save(entity);
        log.info("Update healthcare staff success with ID: " + entity.getId());
    }

    public void delete(String id) {
        log.info("Delete healthcare staff with ID: " + id);
        HealthcareStaff entity = modelMapper.map(get(id, true), HealthcareStaff.class);
        entity.setDeleted(true);
        healthcareStaffRepository.save(entity);
        log.info("Delete healthcare staff success with ID: " + id);
    }

    //
    //
    private void validateStaff(HealthcareStaffDto t) {
        switch (t.getStaffType()) {
            case DOCTOR:
                if (t.getTitle() == null || t.getTitle().isEmpty()) {
                    log.error("Doctor title is required");
                    throw new CustomException("Vui lòng nhập chức danh của bác sĩ", HttpStatus.BAD_REQUEST.value());
                }
                break;
            case NURSE:
                if (t.getLevel() == null) {
                    log.error("Nurse level is required");
                    throw new CustomException("Vui lòng nhập hạng của điều dưỡng", HttpStatus.BAD_REQUEST.value());
                } else {
                    if (t.getLevel() != NurseLevel.LEVEL2 && t.getLevel() != NurseLevel.LEVEL3
                            && t.getLevel() != NurseLevel.LEVEL4) {
                        log.error("Nurse level is invalid");
                        throw new CustomException("Hạng của điều dưỡng phải là 2, 3 hoặc 4",
                                HttpStatus.BAD_REQUEST.value());
                    }
                }
                break;
            case RECEPTIONIST:
                if (t.getComputerLiteracy() == null || t.getComputerLiteracy().isEmpty()) {
                    log.error("Receptionist computer literacy is required");
                    throw new CustomException("Vui lòng nhập trình độ tin học văn phòng của nhân viên tiếp nhận",
                            HttpStatus.BAD_REQUEST.value());
                }
                break;
            default:
                log.error("Staff type is invalid");
                throw new CustomException("Loại nhân viên không hợp lệ", HttpStatus.BAD_REQUEST.value());
        }
    }

    public List<HealthcareStaffDto> getAllDoctorSchedule() {
        log.info("Get all doctor schedule");
        List<HealthcareStaff> entities = healthcareStaffRepository.findByAllDoctorSchedule();
        log.info("Get all doctor schedule success with total staffs: " + entities.size());
        return entities.stream().map(entity -> modelMapper.map(entity, HealthcareStaffDto.class)).toList();
    }
}
