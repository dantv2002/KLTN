package com.hospitalx.emr.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

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
    private ModelMapper modelMapper;

    @Override
    public DepartmentDto save(DepartmentDto t) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }

    @Override
    public Page<DepartmentDto> getAll(String keyword, String type, Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAll'");
    }

    @Override
    public DepartmentDto get(String id) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> {
            log.error("Department not found");
            throw new CustomException("Khoa không tồn tại", HttpStatus.NOT_FOUND.value());
        });
        if (department.getDeleted()) {
            log.error("Department is deleted");
            throw new CustomException("Khoa không tồn tại", HttpStatus.NOT_FOUND.value());
        }
        return modelMapper.map(department, DepartmentDto.class);
    }

    @Override
    public void update(DepartmentDto t) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public void delete(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
