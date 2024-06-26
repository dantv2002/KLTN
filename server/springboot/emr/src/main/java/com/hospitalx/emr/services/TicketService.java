package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.ScheduleTime;
import com.hospitalx.emr.common.TicketStatus;
import com.hospitalx.emr.component.AuthManager;
import com.hospitalx.emr.exception.CustomException;
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
public class TicketService {
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
    private AuthManager authManager;
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
        HealthcareStaffDto doctorDto = healthcareStaffService.get(idDoctor, true);
        DepartmentDto departmentDto = departmentService.get(doctorDto.getDepartmentId(), true);
        ScheduleDto scheduleDto = scheduleService.get(idSchedule);
        String accountId = authManager.getAuthentication().getName();
        // Set value for ticket
        int examinationTime = 15; // Thời gian khám bệnh (phút)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime starTime = scheduleDto.getTime().equals(ScheduleTime.MORNING) ? LocalTime.of(7, 00)
                : LocalTime.of(13, 00);
        LocalTime predictTime = starTime.plusMinutes(examinationTime * scheduleDto.getNumber());
        TicketDto ticketDto = new TicketDto();
        scheduleDto.setNumber(scheduleDto.getNumber() + 1); // Update number of patients
        ticketDto.setNumber(scheduleDto.getNumber()); // STT
        ticketDto.setArea(departmentDto.getLocation()); // Khu vực khám
        ticketDto.setClinic(scheduleDto.getClinic()); // Phòng khám
        ticketDto.setDepartment(departmentDto.getNameDepartment()); // Khoa khám
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
        ticketDto.setAccountId(accountId);
        // Save ticket
        TicketDto ticketBooking = save(ticketDto);
        // Send email
        emailService.sendEmailTicket(recordDto.getEmail(), ticketBooking);
        scheduleService.update(scheduleDto);
        log.info("Create ticket success with ID: " + ticketBooking.getId());
    }

    private TicketDto save(TicketDto t) {
        log.info("Save ticket: " + t);
        return modelMapper.map(ticketRepository.save(modelMapper.map(t, Ticket.class)), TicketDto.class);
    }

    public Page<TicketDto> getAll(String keyword, String type, Pageable pageable) {
        log.info("Get all tickets");
        String[] parts = type.split("_", -1);
        String accountId = authManager.getAuthentication().getName();
        String role = authManager.getAuthentication().getAuthorities().toArray()[0].toString();
        if (role.equals("ROLE_PATIENT")) {
            parts[0] = parts[0].isEmpty() ? parts[0] : "^" + parts[0] + "$";
            return ticketRepository.findAllByIdAndStatus(accountId, parts[0], pageable)
                    .map(ticket -> modelMapper.map(ticket, TicketDto.class));
        }
        if (parts[1].isEmpty()) {
            log.error("Location is empty");
            throw new CustomException("Vui lòng nhập khu vực khám!", HttpStatus.BAD_REQUEST.value());
        }
        HealthcareStaffDto nurse = healthcareStaffService.getByAccountId(accountId);
        DepartmentDto departmentDto = departmentService.get(nurse.getDepartmentId(), true);
        if (!departmentDto.getClinics().contains(parts[1])) {
            log.error("Clinic is invalid");
            throw new CustomException(departmentDto.getNameDepartment() + " không có phòng: " + parts[1],
                    HttpStatus.BAD_REQUEST.value());
        }
        String location = departmentDto.getLocation();
        String timeString = "12:00";
        Boolean isNoon = LocalTime.now().isAfter(LocalTime.parse(timeString));
        LocalTime noon = LocalTime.parse(timeString);
        List<TicketDto> tickets = ticketRepository
                .nurseFindByAll(keyword, "waiting", new SimpleDateFormat("dd/MM/yyyy").format(new Date()), location,
                        parts[1], Pageable.unpaged())
                .stream()
                .filter(ticket -> {
                    LocalTime time = LocalTime.parse(ticket.getTime());
                    return isNoon ? time.isAfter(noon) : time.isBefore(noon);
                })
                .map(ticket -> modelMapper.map(ticket, TicketDto.class))
                .collect(Collectors.toList());
        return new PageImpl<>(tickets, Pageable.unpaged(), tickets.size());
    }

    public TicketDto get(String id) {
        log.info("Get ticket by ID: " + id);
        return modelMapper.map(ticketRepository.findById(id).orElseThrow(() -> {
            log.error("Ticket not found with ID: " + id);
            return new CustomException("Không tìm thấy phiếu khám!", HttpStatus.NOT_FOUND.value());
        }), TicketDto.class);
    }

    public void update(TicketDto t) {
        log.info("Update ticket with ID: " + t.getId());
        t = this.get(t.getId());
        t.setStatus(TicketStatus.COMPLETED);
        ticketRepository.save(modelMapper.map(t, Ticket.class));
        log.info("Update ticket success with ID: " + t.getId());
    }
}
