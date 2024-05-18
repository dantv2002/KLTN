package com.hospitalx.emr.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminService {
    @Autowired
    private RecordService recordService;
    @Autowired
    private MedicalService medicalService;
    @Autowired 
    private AccountService accountService;
    @Autowired
    private TicketService ticketService;
}
