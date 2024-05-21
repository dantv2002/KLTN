package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.common.ScheduleTime;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.models.dtos.ScheduleDto;
import com.hospitalx.emr.models.entitys.Schedule;
import com.hospitalx.emr.repositories.ScheduleRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScheduleService implements IDAO<ScheduleDto> {
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private HealthcareStaffService healthcareStaffService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private AuthenticationFacade authenticationFacade;
    private Date startDate = null;
    private Date endDate = null;

    public int callNext(String numberClinic, String location) {
        log.info("Call next number of clinic: {}", numberClinic);
        String accountId = authenticationFacade.getAuthentication().getName();
        HealthcareStaffDto nurse = healthcareStaffService.getByAccountId(accountId);
        List<ScheduleDto> scheduleDtos = this.getSchedule(nurse.getDepartmentId());
        if (scheduleDtos == null || scheduleDtos.isEmpty()) {
            log.error("Schedule is empty");
            throw new CustomException("Không tìm thấy lịch khám", HttpStatus.NOT_FOUND.value());
        }
        ZonedDateTime now = ZonedDateTime.now();
        ScheduleTime time = now.getHour() < 12 ? ScheduleTime.MORNING : ScheduleTime.AFTERNOON;
        ScheduleDto scheduleDto = scheduleDtos.stream()
                .filter(item -> item.getLocation().equalsIgnoreCase(location) && item.getClinic().equals(numberClinic)
                        && item.getTime().equals(time))
                .findFirst()
                .orElseThrow(() -> new CustomException("Không tìm thấy lịch khám", HttpStatus.NOT_FOUND.value()));
        if (scheduleDto.getCallNumber() < scheduleDto.getNumber()) {
            scheduleDto.setCallNumber(scheduleDto.getCallNumber() + 1);
            this.update(scheduleDto);
        } else {
            log.error("Number is invalid");
            throw new CustomException("Đã gọi hết bệnh nhân chờ khám", HttpStatus.BAD_REQUEST.value());
        }
        log.info("Called number: {}", scheduleDto.getCallNumber());
        return scheduleDto.getCallNumber();
    }

    public List<ScheduleDto> getSchedule(String departmentId) {
        log.info("Get schedule of department: {}", departmentId);
        departmentService.get(departmentId); // Check department exists
        List<HealthcareStaffDto> doctors = healthcareStaffService.getAllByDepartmentId(departmentId);
        List<ScheduleDto> schedules = new ArrayList<>();
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("GMT+0"));
        Date date = Date.from(now.toInstant());
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        startDate = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        endDate = calendar.getTime();
        List<String> listDoctorId = doctors.stream().map(item -> item.getId()).collect(Collectors.toList());
        listDoctorId.stream().forEach(doctorId -> {
            scheduleRepository.findAllTimeDoctor(doctorId, startDate, endDate).forEach(schedule -> {
                ScheduleDto scheduleDto = modelMapper.map(schedule, ScheduleDto.class);
                schedules.add(scheduleDto);
            });
        });
        return schedules;
    }

    public List<ScheduleDto> getTime(String doctorId, String time) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        Date date = null;
        try {
            date = formatter.parse(time);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            startDate = calendar.getTime();
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
            endDate = calendar.getTime();
        } catch (Exception e) {
            log.error("Parse date error: " + e.getMessage());
            throw new CustomException("Ngày không hợp lệ", HttpStatus.BAD_REQUEST.value());
        }
        log.info("Get time of doctor: {}", doctorId);
        return scheduleRepository.findAllTimeDoctor(doctorId, startDate, endDate).stream()
                .map(schedule -> modelMapper.map(schedule, ScheduleDto.class))
                .collect(Collectors.toList());
    }

    public int registerClinic(String scheduleId) {
        log.info("Register clinic");
        ScheduleDto scheduleDto = this.get(scheduleId);
        scheduleDto.setNumber(scheduleDto.getNumber() + 1);
        this.update(scheduleDto);
        return scheduleDto.getNumber();
    }

    public void adminUpdateSchedule(String idDoctor, List<ScheduleDto> scheduleDtoList) {
        log.info("Updating schedule");
        HealthcareStaffDto healthcareStaffDto = healthcareStaffService.get(idDoctor); // Check doctor exists
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            if (scheduleDto.getDate().before(new Date())) {
                log.error("Date is invalid");
                throw new CustomException("Ngày khám phải sau ngày hiện tại", HttpStatus.BAD_REQUEST.value());
            }
        }
        this.checkSchedule(scheduleDtoList);
        Boolean flag = false;
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            if (scheduleDto.getDoctorId() == null) {
                scheduleDto.setDoctorId(idDoctor);
            }
            String idSchedule = this.save(scheduleDto).getId();
            if (!healthcareStaffDto.getSchedules().contains(idSchedule)) {
                healthcareStaffDto.getSchedules().add(idSchedule);
                flag = true;
            }
        }
        if (flag) {
            healthcareStaffService.update(healthcareStaffDto); // Update doctor
        }
    }

    public void adminCreateSchedule(String idDoctor, List<ScheduleDto> scheduleDtoList) {
        log.info("Creating schedule for doctor: {}", idDoctor);
        HealthcareStaffDto healthcareStaffDto = healthcareStaffService.get(idDoctor); // Check doctor exists
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            if (scheduleDto.getDate().before(new Date())) {
                log.error("Date is invalid");
                throw new CustomException("Ngày khám phải sau ngày hiện tại", HttpStatus.BAD_REQUEST.value());
            }
        }
        this.checkSchedule(scheduleDtoList);
        if (healthcareStaffDto.getSchedules() == null) {
            healthcareStaffDto.setSchedules(new ArrayList<String>());
        }
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            scheduleDto.setDoctorId(idDoctor);
            healthcareStaffDto.getSchedules().add(this.save(scheduleDto).getId()); // Save schedule and add to doctor
        }
        healthcareStaffService.update(healthcareStaffDto); // Update doctor
    }

    @Override
    public ScheduleDto save(ScheduleDto t) {
        log.info("Saving schedule: {}", t);
        Schedule schedule = scheduleRepository.save(modelMapper.map(t, Schedule.class));
        log.info("Saved schedule: {}", schedule);
        return modelMapper.map(schedule, ScheduleDto.class);
    }

    @Override
    public Page<ScheduleDto> getAll(String keyword, String type, Pageable pageable) {
        log.info("Get all schedules with doctorId: " + keyword);
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("GMT+0"));
        return scheduleRepository.findByAllDoctorId(keyword, Date.from(now.toInstant()), pageable)
                .map(schedule -> modelMapper.map(schedule, ScheduleDto.class));
    }

    @Override
    public ScheduleDto get(String id) {
        log.info("Get schedule with id: " + id);
        return modelMapper.map(scheduleRepository.findById(id).orElseThrow(
                () -> new CustomException("Lịch khám không tồn tại", HttpStatus.NOT_FOUND.value())), ScheduleDto.class);
    }

    @Override
    public void update(ScheduleDto t) {
        log.info("Updating schedule: {}", t);
        Schedule schedule = scheduleRepository.save(modelMapper.map(t, Schedule.class));
        log.info("Updated schedule: {}", schedule);
    }

    @Override
    public void delete(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    //
    //

    private void checkSchedule(List<ScheduleDto> scheduleDtoList) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        // check duplicate
        Map<String, Long> map = scheduleDtoList.stream()
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getLocation() + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                })
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        if (map.values().stream().anyMatch(value -> value > 1)) {
            log.error("Schedule is invalid");
            throw new CustomException("Có lịch khám trùng nhau", HttpStatus.BAD_REQUEST.value());
        }
        // check in database
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("GMT+0"));
        List<Schedule> schedules = scheduleRepository.findAll(Date.from(now.toInstant()));
        Set<String> scheduleSet = schedules.stream()
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getLocation() + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                })
                .collect(Collectors.toSet());
        scheduleDtoList.stream()
                .filter(item -> item.getId() == null)
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getLocation() + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                })
                .filter(scheduleSet::contains)
                .findFirst()
                .ifPresent(item -> {
                    log.error("Schedule is invalid");
                    String[] split = item.split("_", -1);
                    throw new CustomException(
                            "Lịch khám: ngày " + split[0] + ", vị trí " + split[1] + ", phòng " + split[2] + ", buổi "
                                    + (split[3].equals("MORNING")
                                            ? "sáng"
                                            : "chiều")
                                    + " đã tồn tại",
                            HttpStatus.BAD_REQUEST.value());
                });
        Map<String, String> scheduleMap = scheduleDtoList.stream()
                .filter(item -> item.getId() != null)
                .collect(Collectors.toMap(item -> item.getId(), item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getLocation() + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                }));
        Map<String, String> scheduleDBMap = schedules.stream().collect(Collectors.toMap(item -> item.getId(), item -> {
            String formattedDate = formatter.format(item.getDate());
            return formattedDate + "_" + item.getLocation() + "_" + item.getClinic() + "_"
                    + item.getTime().toString();
        }));
        scheduleMap.entrySet().stream()
                .filter(item -> scheduleDBMap.entrySet().stream()
                        .anyMatch(entry -> entry.getValue().equals(item.getValue())
                                && !entry.getKey().equals(item.getKey())))
                .findFirst()
                .ifPresent(item -> {
                    log.error("Schedule is invalid");
                    String[] split = item.getValue().split("_", -1);
                    throw new CustomException(
                            "Lịch khám: ngày " + split[0] + ", vị trí " + split[1] + ", phòng " + split[2] + ", buổi "
                                    + (split[3].equals("MORNING")
                                            ? "sáng"
                                            : "chiều")
                                    + " đã tồn tại",
                            HttpStatus.BAD_REQUEST.value());
                });
    }
}
