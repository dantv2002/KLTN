package com.hospitalx.emr.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.NurseLevel;
import com.hospitalx.emr.common.StaffType;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.models.entitys.HealthcareStaff;
import com.hospitalx.emr.repositories.HealthcareStaffRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class HealthcareStaffService implements IDAO<HealthcareStaffDto> {
    @Autowired
    private HealthcareStaffRepository healthcareStaffRepository;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public HealthcareStaffDto save(HealthcareStaffDto t) {
        // validate
        validateStaff(t);
        log.info("Save healthcare staff: " + t.toString());
        if (healthcareStaffRepository.findByIdentityCard(t.getIdentityCard()).isPresent()) {
            log.error("Identity card is already exists");
            throw new CustomException("Nhân viên y tế này đã tồn tại", HttpStatus.BAD_REQUEST.value());
        }
        departmentService.get(t.getDepartmentId()); // check department exists
        HealthcareStaff entity = modelMapper.map(t, HealthcareStaff.class);
        entity = healthcareStaffRepository.save(entity);
        log.info("Save healthcare staff success with ID: " + entity.getId());
        return modelMapper.map(entity, HealthcareStaffDto.class);
    }

    @Override
    public Page<HealthcareStaffDto> getAll(String keyword, String type, Pageable pageable) {
        type = type.toLowerCase();
        if (type != null && !type.isEmpty() && !type.equals("doctor") && !type.equals("nurse")
                && !type.equals("receptionist")) {
            log.error("Staff type is invalid");
            throw new CustomException("Loại nhân viên không hợp lệ", HttpStatus.BAD_REQUEST.value());
        }
        log.info("Get all healthcare staffs with type: " + type);
        Page<HealthcareStaff> entities = null;
        String[] parts = keyword.split("_", -1);
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
        return entities.map(entity -> modelMapper.map(entity, HealthcareStaffDto.class));
    }

    @Override
    public HealthcareStaffDto get(String id) {
        log.info("Get healthcare staff with ID: " + id);
        HealthcareStaff entity = healthcareStaffRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy nhân viên y tế", HttpStatus.NOT_FOUND.value()));
        log.info("Get healthcare staff success");
        if (entity.getDeleted()) {
            log.error("Healthcare staff is deleted");
            throw new CustomException("Không tìm thấy nhân viên y tế", HttpStatus.NOT_FOUND.value());
        }
        return modelMapper.map(entity, HealthcareStaffDto.class);
    }

    @Override
    public void update(HealthcareStaffDto t) {
        get(t.getId()); // check staff exists
        // validate
        validateStaff(t);
        log.info("Update healthcare staff: " + t.toString());
        departmentService.get(t.getDepartmentId()); // check department exists
        HealthcareStaff entity = modelMapper.map(t, HealthcareStaff.class);
        entity = healthcareStaffRepository.save(entity);
        log.info("Update healthcare staff success with ID: " + entity.getId());
    }

    @Override
    public void delete(String id) {
        log.info("Delete healthcare staff with ID: " + id);
        HealthcareStaff entity = modelMapper.map(get(id), HealthcareStaff.class);
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
}
