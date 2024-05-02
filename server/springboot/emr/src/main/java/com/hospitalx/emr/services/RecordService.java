package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

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
        checkExistRecord(t.getIdentityCard(), null);
        log.info("Save record: " + t.toString());
        String id = authenticationFacade.getAuthentication().getName();
        AccountDto account = accountService.get(id);
        if (account.getRecords() != null && account.getRecords().size() == 10) {
            log.error("Record limit exceeded!");
            throw new CustomException("Số lượng hồ sơ đã đạt giới hạn tối đa!",
                    HttpStatus.BAD_REQUEST.value());
        }
        Record record = recordRepository.save(modelMapper.map(t, Record.class));
        if (account.getRecords() == null) {
            account.setRecords(new ArrayList<String>());
        }
        account.getRecords().add(record.getId());
        accountService.update(account);
        log.info("Save record success with ID: " + record.getId() + " for account: " + account.getId());
        return modelMapper.map(record, RecordDto.class);
    }

    @Override
    public Page<RecordDto> getAll(String keyword, String type, Pageable pageable) {
        String id = authenticationFacade.getAuthentication().getName();
        AccountDto accountDto = accountService.get(id);
        log.info("Get all records for account: " + accountDto.getId());
        if (accountDto.getRole().equals("NURSE")) {
            String[] parts = keyword.split("_", -1);

            Date starDate = createDateFromString(parts[1], 0);
            Date endDate = createDateFromString(parts[1], 1);
            log.info("Get all records for nurse with keyword: " + parts[0] + ", year: " + parts[1] + ", gender: "
                    + parts[2]);
            if (starDate == null || endDate == null) {
                return recordRepository.findAllByKeyword(parts[0], parts[2], pageable)
                        .map(record -> modelMapper.map(record, RecordDto.class));
            }
            return recordRepository.findAllByKeyword(parts[0], starDate, endDate, parts[2], pageable)
                    .map(record -> modelMapper.map(record, RecordDto.class));
        }
        if (accountDto.getRecords() == null || accountDto.getRecords().isEmpty()) {
            log.info("No records found for account: " + accountDto.getId());
            return Page.empty();
        }
        log.info("Get all records success for account: " + accountDto.getId() + " with total records: "
                + accountDto.getRecords().size() + " records");
        return recordRepository.findAllById(accountDto.getRecords(), pageable)
                .map(record -> modelMapper.map(record, RecordDto.class));
    }

    @Override
    public RecordDto get(String id) {
        log.info("Get record with ID: " + id);
        String accountId = authenticationFacade.getAuthentication().getName();
        AccountDto account = accountService.get(accountId);
        if (!account.getRole().equals("NURSE") && (account.getRecords() == null || account.getRecords().isEmpty()
                || !account.getRecords().contains(id))) {
            log.error("Record not found for account: " + account.getId());
            throw new CustomException("Không tìm thấy hồ sơ", HttpStatus.NOT_FOUND.value());
        }
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy hồ sơ", HttpStatus.NOT_FOUND.value()));
        log.info("Get record success with ID: " + id);
        return modelMapper.map(record, RecordDto.class);
    }

    @Override
    public void update(RecordDto t) {
        log.info("Update record: " + t.toString());
        String id = authenticationFacade.getAuthentication().getName();
        AccountDto account = accountService.get(id);
        if (account.getRecords() == null || account.getRecords().isEmpty()
                || !account.getRecords().contains(t.getId())) {
            log.error("Record not found for account: " + account.getId());
            throw new CustomException("Không tìm thấy hồ sơ", HttpStatus.NOT_FOUND.value());
        }
        checkExistRecord(t.getIdentityCard(), t.getId());
        Record record = recordRepository.findById(t.getId())
                .orElseThrow(() -> new CustomException("Không tìm thấy hồ sơ", HttpStatus.NOT_FOUND.value()));
        if (record.getLocked()) {
            log.info("Record is locked!");
            t.setId(null);
            record = recordRepository.save(modelMapper.map(t, Record.class));
            account.getRecords().remove(t.getId());
            account.getRecords().add(record.getId());
            accountService.update(account);
            log.info("Update record success with ID: " + record.getId());
        } else {
            recordRepository.save(modelMapper.map(t, Record.class));
            log.info("Update record success with ID: " + t.getId());
        }
    }

    @Override
    public void delete(String id) {
        log.info("Delete record with ID: " + id);
        String accountId = authenticationFacade.getAuthentication().getName();
        AccountDto account = accountService.get(accountId);
        if (account.getRecords() == null || account.getRecords().isEmpty() || !account.getRecords().contains(id)) {
            log.error("Record not found for account: " + account.getId());
            throw new CustomException("Không tìm thấy hồ sơ", HttpStatus.NOT_FOUND.value());
        }
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy hồ sơ", HttpStatus.NOT_FOUND.value()));
        if (record.getLocked()) {
            log.info("Record is locked!");
            record.setDeleted(true);
            recordRepository.save(record);
        } else {
            recordRepository.delete(record);
        }
        account.getRecords().remove(id);
        accountService.update(account);
        log.info("Delete record success with ID: " + id);
    }

    //
    //
    private void checkExistRecord(String identityCard, String id) {
        if (identityCard != null && !identityCard.isEmpty()) {
            Page<RecordDto> records = this.getAll("", "", Pageable.unpaged());
            records.stream().forEach(record -> {
                if (record.getIdentityCard().equals(identityCard) && (id == null || !record.getId().equals(id))) {
                    log.error("Record already exists with identity card: " + identityCard);
                    throw new CustomException("Hồ sơ của người này đã tồn tại!", HttpStatus.CONFLICT.value());
                }
            });
        }

    }

    private Date createDateFromString(String year, int plusYear) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        try {
            int yearInt = Integer.parseInt(year) + plusYear;
            String dateString = "01/01/" + yearInt;
            return formatter.parse(dateString);
        } catch (Exception e) {
            log.error("Parse date error: " + e.getMessage());
            return null;
        }
    }
}
