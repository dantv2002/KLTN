package com.hospitalx.emr.services;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.DepartmentDto;
import com.hospitalx.emr.models.entitys.Department;
import com.hospitalx.emr.repositories.DepartmentRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DepartmentService implements IDAO<DepartmentDto> {
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private AuthenticationFacade authenticationFacade;
    @Autowired
    private ModelMapper modelMapper;
    private Department departmentTemp;

    public void create(DepartmentDto departmentDto) {
        this.checkDepartmentExist(departmentDto.getNameDepartment());
        if (departmentTemp != null) {
            log.info("Restore department with name: {}", departmentTemp.getNameDepartment());
            departmentTemp.setDeleted(false);
            departmentRepository.save(departmentTemp);
            return;
        }
        this.save(departmentDto);
    }

    @Override
    public DepartmentDto save(DepartmentDto t) {
        log.info("Create new department with name: {}", t.getNameDepartment());
        Department department = modelMapper.map(t, Department.class);
        department = departmentRepository.save(department);
        return modelMapper.map(department, DepartmentDto.class);
    }

    @Override
    public Page<DepartmentDto> getAll(String keyword, String type, Pageable pageable) {
        log.info("Get all departments");
        String role = authenticationFacade.getAuthentication().getAuthorities().toArray()[0].toString();
        Page<Department> departments = null;
        if (role.equals("ROLE_ADMIN")) {
            departments = departmentRepository.findByNameDepartment(keyword, pageable);
        } else {
            List<Department> departmentList = departmentRepository.findByAll();
            pageable = PageRequest.of(0, departmentList.size());
            departments = new PageImpl<>(departmentList, pageable, departmentList.size());
        }
        return departments.map(department -> modelMapper.map(department, DepartmentDto.class));
    }

    @Override
    public DepartmentDto get(String id) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> {
            log.error("Department not found");
            throw new CustomException("Khoa không tồn tại", HttpStatus.NOT_FOUND.value());
        });
        return modelMapper.map(department, DepartmentDto.class);
    }

    @Override
    public void update(DepartmentDto t) {
        log.info("Update department with id: {}", t.getId());
        this.checkDepartmentExist(t.getId(), t.getNameDepartment());
        Department department = modelMapper.map(t, Department.class);
        departmentRepository.save(department);
    }

    @Override
    public void delete(String id) {
        log.info("Delete department with id: {}", id);
        DepartmentDto departmentDto = this.get(id);
        departmentDto.setDeleted(true);
        departmentRepository.save(modelMapper.map(departmentDto, Department.class));
    }

    private void checkDepartmentExist(String name) {
        name = "^" + name + "$";
        departmentTemp = null;
        departmentRepository.findByNameDepartment(name).ifPresent(department -> {
            if (!department.getDeleted()) {
                log.error("Department is existed");
                throw new CustomException("Khoa đã tồn tại", HttpStatus.BAD_REQUEST.value());
            } else {
                departmentTemp = department;
            }
        });
    }

    private void checkDepartmentExist(String id, String name) {
        name = "^" + name + "$";
        departmentRepository.findByNotIdAndNameDepartment(id, name).ifPresent(department -> {
            log.error("Department is existed");
            throw new CustomException("Khoa đã tồn tại", HttpStatus.BAD_REQUEST.value());
        });
    }

}
