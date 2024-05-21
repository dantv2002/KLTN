package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.common.ScheduleTime;
import com.hospitalx.emr.common.TicketStatus;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.AccountDto;
import com.hospitalx.emr.models.dtos.DepartmentDto;
import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.models.dtos.RecordDto;
import com.hospitalx.emr.models.dtos.ScheduleDto;
import com.hospitalx.emr.models.dtos.TicketDto;
import com.hospitalx.emr.models.entitys.Ticket;
import com.hospitalx.emr.repositories.TicketRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TicketService implements IDAO<TicketDto> {
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private HealthcareStaffService healthcareStaffService;
    @Autowired
    private RecordService recordService;
    @Autowired
    private ScheduleService scheduleService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuthenticationFacade authenticationFacade;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private EmailService emailService;

    public List<Ticket> getDashboard(Date startDate, Date endDate) {
        return ticketRepository.findAllByCreatedAtBetween(startDate, endDate);
    }

    public int totalTicket() {
        return ticketRepository.totalTicket();
    }

    public void createTicket(String idRecord, String idDoctor, String idSchedule) {
        log.info("Create ticket");
        RecordDto recordDto = recordService.get(idRecord);
        HealthcareStaffDto doctorDto = healthcareStaffService.get(idDoctor);
        DepartmentDto departmentDto = departmentService.get(doctorDto.getDepartmentId());
        ScheduleDto scheduleDto = scheduleService.get(idSchedule);
        // Set value for ticket
        int examinationTime = 15; // Thời gian khám bệnh (phút)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime starTime = scheduleDto.getTime().equals(ScheduleTime.MORNING) ? LocalTime.of(7, 00)
                : LocalTime.of(13, 00);
        LocalTime predictTime = starTime.plusMinutes(examinationTime * scheduleDto.getNumber());
        TicketDto ticketDto = new TicketDto();
        scheduleDto.setNumber(scheduleDto.getNumber() + 1); // Update number of patients
        ticketDto.setNumber(scheduleDto.getNumber()); // STT
        ticketDto.setArea(scheduleDto.getLocation()); // Khu vực khám
        ticketDto.setClinic(scheduleDto.getClinic()); // Phòng khám
        ticketDto.setDepartment(departmentDto.getNameDepartment()); // Khoa khám
        ticketDto.setNameDoctor(doctorDto.getFullName()); // Tên bác sĩ khám
        ticketDto.setDate(new SimpleDateFormat("dd/MM/yyyy").format(scheduleDto.getDate())); // Ngày khám
        ticketDto.setTime(predictTime.format(formatter)); // Giờ khám dự kiến
        ticketDto.setStatus(TicketStatus.WAITING); // Trạng thái
        ticketDto.setNamePatient(recordDto.getFullName()); // Tên người khám
        ticketDto.setRecordId(idRecord); // Mã hồ sơ
        ticketDto.setDateOfBirth(new SimpleDateFormat("dd/MM/yyyy").format(recordDto.getDateOfBirth())); // Ngày sinh
        ticketDto.setGender(recordDto.getGender()); // Giới tính
        ticketDto.setHealthInsurance(recordDto.getHealthInsurance()); // Bảo hiểm y tế
        ticketDto.setAddress(recordDto.getAddress()); // Địa chỉ
        ticketDto.setCreatedAt(new Date());
        // Save ticket
        TicketDto ticketBooking = save(ticketDto);
        // Send email
        emailService.sendEmailTicket(recordDto.getEmail(), ticketBooking);
        // add ticket to account
        AccountDto accountDto = accountService.get(authenticationFacade.getAuthentication().getName());
        if (accountDto.getTickets() == null) {
            accountDto.setTickets(new ArrayList<String>());
        }
        accountDto.getTickets().add(ticketBooking.getId());
        accountService.update(accountDto);
        scheduleService.update(scheduleDto);
        log.info("Create ticket success with ID: " + ticketBooking.getId());
    }

    @Override
    public TicketDto save(TicketDto t) {
        log.info("Save ticket: " + t);
        return modelMapper.map(ticketRepository.save(modelMapper.map(t, Ticket.class)), TicketDto.class);
    }

    @Override
    public Page<TicketDto> getAll(String keyword, String type, Pageable pageable) {
        log.info("Get all tickets");
        AccountDto accountDto = accountService.get(authenticationFacade.getAuthentication().getName());
        keyword = keyword.isEmpty() ? keyword : "^" + keyword + "$";
        return ticketRepository.findAllByIdAndStatus(accountDto.getTickets(), keyword, pageable)
                .map(ticket -> modelMapper.map(ticket, TicketDto.class));
    }

    @Override
    public TicketDto get(String id) {
        log.info("Get ticket by ID: " + id);
        return modelMapper.map(ticketRepository.findById(id).orElseThrow(() -> {
            log.error("Ticket not found with ID: " + id);
            return new CustomException("Không tìm thấy phiếu khám!", HttpStatus.NOT_FOUND.value());
        }), TicketDto.class);
    }

    @Override
    public void update(TicketDto t) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public void delete(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
