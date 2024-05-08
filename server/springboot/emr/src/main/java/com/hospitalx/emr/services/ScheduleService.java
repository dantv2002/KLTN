package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
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

import com.hospitalx.emr.common.ScheduleTime;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.DepartmentDto;
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

    public int registerClinic(String DepartmentId, String clinic) {
        log.info("Registering clinic: {}", clinic);
        departmentService.get(DepartmentId); // Check department exists
        List<HealthcareStaffDto> doctors = healthcareStaffService.getAllByDepartmentId(DepartmentId);
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("GMT+7"));
        int hour = now.getHour();
        ScheduleTime time = hour < 12 ? ScheduleTime.MORNING : ScheduleTime.AFTERNOON;
        List<Schedule> schedules = scheduleRepository.findByAllOfDate(Date.from(now.toInstant()), time, clinic);
        List<String> listIdSchedule = doctors.stream().flatMap(doctor -> doctor.getSchedules().stream())
                .collect(Collectors.toList());
        for (Schedule schedule : schedules) {
            if (listIdSchedule.contains(schedule.getId())) {
                schedule.setNumber(schedule.getNumber() + 1);
                this.update(modelMapper.map(schedule, ScheduleDto.class));
                return schedule.getNumber();
            }
        }
        throw new CustomException("Không tìm thấy lịch khám", HttpStatus.NOT_FOUND.value());
    }

    public void adminUpdateSchedule(String idDoctor, List<ScheduleDto> scheduleDtoList) {
        log.info("Updating schedule");
        HealthcareStaffDto healthcareStaffDto = healthcareStaffService.get(idDoctor); // Check doctor exists
        DepartmentDto departmentDto = departmentService.get(healthcareStaffDto.getDepartmentId()); // Get department of
                                                                                                   // doctor
        Integer numberOfRooms = departmentDto.getNumberOfRooms();
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            this.checkSchedule(numberOfRooms, scheduleDto);
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
        DepartmentDto departmentDto = departmentService.get(healthcareStaffDto.getDepartmentId()); // Get department of
                                                                                                   // doctor
        Integer numberOfRooms = departmentDto.getNumberOfRooms();
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            this.checkSchedule(numberOfRooms, scheduleDto);
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
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("GMT+7"));
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
                    return formattedDate + "_" + item.getClinic() + "_" + item.getTime().toString();
                })
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        if (map.values().stream().anyMatch(value -> value > 1)) {
            log.error("Schedule is invalid");
            throw new CustomException("Có lịch khám trùng nhau", HttpStatus.BAD_REQUEST.value());
        }
        // check in database
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("GMT+7"));
        List<Schedule> schedules = scheduleRepository.findAll(Date.from(now.toInstant()));
        Set<String> set = schedules.stream()
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getClinic() + "_" + item.getTime().toString();
                })
                .collect(Collectors.toSet());
        scheduleDtoList.stream()
                .filter(item -> item.getId() == null)
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getClinic() + "_" + item.getTime().toString();
                })
                .filter(set::contains)
                .findFirst()
                .ifPresent(item -> {
                    log.error("Schedule is invalid");
                    String[] split = item.split("_", -1);
                    throw new CustomException(
                            "Lịch khám: ngày " + split[0] + ", phòng " + split[1] + ", buổi "
                                    + (split[2].equals("MORNING")
                                            ? "sáng"
                                            : "chiều")
                                    + " đã tồn tại",
                            HttpStatus.BAD_REQUEST.value());
                });
    }

    private void checkSchedule(Integer numberOfRooms, ScheduleDto scheduleDto) {
        if (scheduleDto.getDate().before(new Date())) {
            log.error("Date is invalid");
            throw new CustomException("Ngày khám phải sau ngày hiện tại", HttpStatus.BAD_REQUEST.value());
        }
        Integer clinic = Integer.parseInt(scheduleDto.getClinic());
        if (clinic <= 0 || clinic > numberOfRooms) {
            log.error("NumberOfRooms is invalid");
            throw new CustomException("Trong khoa không có phòng khám " + clinic,
                    HttpStatus.BAD_REQUEST.value());
        }
    }
}
