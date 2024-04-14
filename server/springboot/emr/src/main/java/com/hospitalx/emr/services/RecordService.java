package com.hospitalx.emr.services;

import java.util.ArrayList;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.AccountDto;
import com.hospitalx.emr.models.dtos.RecordDto;
import com.hospitalx.emr.models.entitys.Record;
import com.hospitalx.emr.repositories.RecordRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RecordService implements IDAO<RecordDto> {

    @Autowired
    private RecordRepository recordRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuthenticationFacade authenticationFacade;

    //

    // Override methods
    @Override
    public RecordDto save(RecordDto t) {
        log.info("Save record: " + t.toString());
        String id = authenticationFacade.getAuthentication().getName();
        AccountDto account = accountService.get(id);
        if (account.getRecords() != null && account.getRecords().size() == 10) {
            throw new CustomException("The number of record has reached the maximum of 10",
                    HttpStatus.BAD_REQUEST.value());
        }
        Record record = recordRepository.save(modelMapper.map(t, Record.class));
        if (account.getRecords() == null) {
            account.setRecords(new ArrayList<String>());
        }
        account.getRecords().add(record.getId());
        return modelMapper.map(record, RecordDto.class);
    }

    @Override
    public Page<RecordDto> getAll(String keyword, Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAll'");
    }

    @Override
    public RecordDto get(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'get'");
    }

    @Override
    public RecordDto update(RecordDto t) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public Boolean delete(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }
    //
    //
}
