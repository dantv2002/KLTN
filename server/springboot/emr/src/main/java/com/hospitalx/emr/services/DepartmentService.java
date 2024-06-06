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
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.DepartmentDto;
import com.hospitalx.emr.models.entitys.Department;
import com.hospitalx.emr.repositories.DepartmentRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DepartmentService {
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private AuthManager authManager;
    @Autowired
    private ModelMapper modelMapper;

    public void create(DepartmentDto departmentDto) {
        this.checkDepartmentExist(departmentDto.getNameDepartment());
        this.save(departmentDto);
    }

    public DepartmentDto save(DepartmentDto t) {
        log.info("Create new department with name: {}", t.getNameDepartment());
        Department department = modelMapper.map(t, Department.class);
        department = departmentRepository.save(department);
        return modelMapper.map(department, DepartmentDto.class);
    }

    public Page<DepartmentDto> getAll(String keyword, String type, Pageable pageable) {
        log.info("Get all departments");
        String role = authManager.getAuthentication().getAuthorities().toArray()[0].toString();
        Page<Department> departments = null;
        if (role.equals("ROLE_ADMIN") || role.equals("ROLE_RECEPTIONIST")) {
            departments = departmentRepository.findByNameDepartment(keyword, pageable);
        } else if (role.equals("ROLE_PATIENT")) {
            List<String> nameDepartments = new ArrayList<>();
            nameDepartments.add("Khoa chẩn đoán hình ảnh");
            nameDepartments.add("Khoa khám bệnh cấp cứu");
            departments = departmentRepository.findByAll(nameDepartments, Pageable.unpaged());
        } else {
            departments = departmentRepository.findByAll(Pageable.unpaged());
        }
        return departments.map(department -> modelMapper.map(department, DepartmentDto.class));
    }

    public DepartmentDto get(String id, Boolean checkDeleted) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> {
            log.error("Department not found");
            throw new CustomException("Khoa không tồn tại", HttpStatus.NOT_FOUND.value());
        });
        if (checkDeleted && department.getDeleted()) {
            log.error("Department not found");
            throw new CustomException("Khoa không tồn tại", HttpStatus.NOT_FOUND.value());
        }
        return modelMapper.map(department, DepartmentDto.class);
    }

    public void update(DepartmentDto t) {
        log.info("Update department with id: {}", t.getId());
        this.checkDepartmentExist(t.getId(), t.getNameDepartment());
        Department department = modelMapper.map(t, Department.class);
        departmentRepository.save(department);
    }

    public void delete(String id) {
        log.info("Delete department with id: {}", id);
        DepartmentDto departmentDto = this.get(id, true);
        departmentDto.setDeleted(true);
        departmentRepository.save(modelMapper.map(departmentDto, Department.class));
    }

    private void checkDepartmentExist(String name) {
        departmentRepository.findByNameDepartment(name).ifPresent(department -> {
            log.error("Department is existed");
            throw new CustomException("Khoa đã tồn tại", HttpStatus.BAD_REQUEST.value());
        });
    }

    private void checkDepartmentExist(String id, String name) {
        departmentRepository.findByNotIdAndNameDepartment(id, name).ifPresent(department -> {
            log.error("Department is existed");
            throw new CustomException("Khoa đã tồn tại", HttpStatus.BAD_REQUEST.value());
        });
    }

}
