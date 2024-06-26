package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
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

import com.hospitalx.emr.common.ScheduleTime;
import com.hospitalx.emr.component.AuthManager;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.DepartmentDto;
import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.models.dtos.ScheduleDto;
import com.hospitalx.emr.models.entitys.Schedule;
import com.hospitalx.emr.repositories.ScheduleRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScheduleService {
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private HealthcareStaffService healthcareStaffService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private AuthManager authManager;
    private Date startDate = null;
    private Date endDate = null;

    public int callNext(String numberClinic) {
        if (numberClinic.isEmpty()) {
            log.error("Number clinic is empty");
            throw new CustomException("Vui lòng nhập phòng khám!", HttpStatus.BAD_REQUEST.value());
        }
        log.info("Call next number of clinic: {}", numberClinic);
        String accountId = authManager.getAuthentication().getName();
        HealthcareStaffDto nurse = healthcareStaffService.getByAccountId(accountId);
        DepartmentDto department = departmentService.get(nurse.getDepartmentId(), true);
        if (!department.getClinics().contains(numberClinic)) {
            log.error("Clinic is invalid");
            throw new CustomException(department.getNameDepartment() + " không có phòng: " + numberClinic,
                    HttpStatus.BAD_REQUEST.value());
        }
        List<ScheduleDto> scheduleDtos = this.getSchedule(nurse.getDepartmentId());
        if (scheduleDtos == null || scheduleDtos.isEmpty()) {
            log.error("Schedule is empty");
            throw new CustomException("Không tìm thấy lịch khám", HttpStatus.NOT_FOUND.value());
        }
        ZonedDateTime now = ZonedDateTime.now();
        ScheduleTime time = now.getHour() < 12 ? ScheduleTime.MORNING : ScheduleTime.AFTERNOON;
        ScheduleDto scheduleDto = scheduleDtos.stream()
                .filter(item -> item.getClinic().equals(numberClinic) && item.getTime().equals(time))
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
        DepartmentDto department = departmentService.get(departmentId, true); // Check department exists
        List<HealthcareStaffDto> doctors = healthcareStaffService.getAllByDepartmentId(departmentId);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        ScheduleTime time = calendar.get(Calendar.HOUR_OF_DAY) < 12 ? ScheduleTime.MORNING : ScheduleTime.AFTERNOON;
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        startDate = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        endDate = calendar.getTime();
        List<String> doctorIds = doctors.stream().map(item -> item.getId()).collect(Collectors.toList());
        return scheduleRepository.findAllTimeDoctor(doctorIds, time, startDate, endDate).stream()
                .map(schedule -> {
                    ScheduleDto scheduleDto = modelMapper.map(schedule, ScheduleDto.class);
                    scheduleDto.setLocation(department.getLocation());
                    return scheduleDto;
                })
                .collect(Collectors.toList());
    }

    public List<ScheduleDto> getTime(String doctorId, String time) {
        HealthcareStaffDto doctor = healthcareStaffService.get(doctorId, true); // Check doctor exists
        DepartmentDto department = departmentService.get(doctor.getDepartmentId(), true);
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
                .map(schedule -> {
                    ScheduleDto scheduleDto = modelMapper.map(schedule, ScheduleDto.class);
                    scheduleDto.setLocation(department.getLocation());
                    return scheduleDto;
                })
                .collect(Collectors.toList());
    }

    public ScheduleDto registerClinic(String scheduleId) {
        log.info("Register clinic");
        ScheduleDto scheduleDto = this.get(scheduleId);
        scheduleDto.setNumber(scheduleDto.getNumber() + 1);
        this.update(scheduleDto);
        return scheduleDto;
    }

    public void deleteSchedule(String idDoctor, String idSchedule) {
        log.info("Deleting schedule");
        healthcareStaffService.get(idDoctor, true); // Check doctor exists
        ScheduleDto scheduleDto = this.get(idSchedule);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.set(Calendar.HOUR_OF_DAY, 7);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date now = calendar.getTime();
        if (scheduleDto.getDate().equals(now)) {
            log.error("Schedule is invalid");
            throw new CustomException("Không thể xóa lịch khám của ngày hiện tại", HttpStatus.BAD_REQUEST.value());
        }
        if (scheduleDto.getDate().after(now) && scheduleDto.getNumber() > 0) {
            log.error("Schedule is invalid");
            throw new CustomException("Không thể xóa lịch khám đã có bệnh nhân đăng ký",
                    HttpStatus.BAD_REQUEST.value());
        }
        this.delete(idSchedule); // Delete schedule
        log.info("Deleted schedule");
    }

    public void updateSchedule(String idDoctor, List<ScheduleDto> scheduleDtoList) {
        log.info("Updating schedule");
        HealthcareStaffDto doctor = healthcareStaffService.get(idDoctor, true); // Check doctor exists
        DepartmentDto department = departmentService.get(doctor.getDepartmentId(), true);
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            if (scheduleDto.getDate().before(new Date())) {
                log.error("Date is invalid");
                throw new CustomException("Ngày khám phải sau ngày hiện tại", HttpStatus.BAD_REQUEST.value());
            }
        }
        this.checkSchedule(scheduleDtoList, department);
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            if (scheduleDto.getDoctorId() == null) {
                scheduleDto.setDoctorId(idDoctor);
            }
            this.save(scheduleDto);
        }
    }

    public void createSchedule(String idDoctor, List<ScheduleDto> scheduleDtoList) {
        log.info("Creating schedule for doctor: {}", idDoctor);
        HealthcareStaffDto doctor = healthcareStaffService.get(idDoctor, true); // Check doctor exists
        DepartmentDto department = departmentService.get(doctor.getDepartmentId(), true);
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            if (scheduleDto.getDate().before(new Date())) {
                log.error("Date is invalid");
                throw new CustomException("Ngày khám phải sau ngày hiện tại", HttpStatus.BAD_REQUEST.value());
            }
        }
        this.checkSchedule(scheduleDtoList, department);
        for (ScheduleDto scheduleDto : scheduleDtoList) {
            scheduleDto.setDoctorId(idDoctor);
            this.save(scheduleDto);
        }
    }

    private ScheduleDto save(ScheduleDto t) {
        log.info("Saving schedule: {}", t);
        Schedule schedule = scheduleRepository.save(modelMapper.map(t, Schedule.class));
        log.info("Saved schedule: {}", schedule);
        return modelMapper.map(schedule, ScheduleDto.class);
    }

    public Page<ScheduleDto> getAll(String keyword, String type, Pageable pageable) {
        log.info("Get all schedules with doctorId: " + keyword);
        HealthcareStaffDto doctor = healthcareStaffService.get(keyword, true); // Check doctor exists
        DepartmentDto department = departmentService.get(doctor.getDepartmentId(), true);
        return scheduleRepository.findByAllDoctorId(keyword, new Date(), pageable)
                .map(schedule -> {
                    ScheduleDto scheduleDto = modelMapper.map(schedule, ScheduleDto.class);
                    scheduleDto.setLocation(department.getLocation());
                    return scheduleDto;
                });
    }

    public ScheduleDto get(String id) {
        log.info("Get schedule with id: " + id);
        return modelMapper.map(scheduleRepository.findById(id).orElseThrow(
                () -> new CustomException("Lịch khám không tồn tại", HttpStatus.NOT_FOUND.value())), ScheduleDto.class);
    }

    public void update(ScheduleDto t) {
        log.info("Updating schedule: {}", t);
        Schedule schedule = scheduleRepository.save(modelMapper.map(t, Schedule.class));
        log.info("Updated schedule: {}", schedule);
    }

    private void delete(String id) {
        log.info("Deleting schedule with id: " + id);
        scheduleRepository.deleteById(id);
        log.info("Deleted schedule with id: " + id);
    }

    public void deleteSchedulesBeforeMonth() {
        Calendar calendar = Calendar.getInstance();
        log.info("Deleting schedules before month: " + (calendar.get(Calendar.MONTH) + 1));
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        List<String> scheduleIds = scheduleRepository.getAllByDateLessThan(calendar.getTime()).stream()
                .map(item -> item.getId())
                .collect(Collectors.toList());
        if (scheduleIds.size() == 0) {
            log.info("No schedule to delete");
            throw new CustomException("Không có lịch khám để xóa", HttpStatus.NOT_FOUND.value());
        }
        scheduleRepository.deleteAllById(scheduleIds);
        log.info("Deleted schedules before month: " + (calendar.get(Calendar.MONTH) + 1));
    }
    //
    //

    private void checkSchedule(List<ScheduleDto> scheduleDtoList, DepartmentDto department) {
        String idDepartment = department.getId();
        String nameDepartment = department.getNameDepartment();
        String location = department.getLocation();
        // check clinic
        scheduleDtoList.stream()
                .forEach(schedule -> {
                    if (!department.getClinics().contains(schedule.getClinic())) {
                        log.error("Clinic is invalid");
                        throw new CustomException("Phòng " + schedule.getClinic() + " của "
                                + department.getNameDepartment() + " không tồn tại", HttpStatus.BAD_REQUEST.value());
                    }
                });
        //
        List<String> doctorIds = healthcareStaffService.getAllDoctorByDepartmentId(idDepartment).stream()
                .map(item -> item.getId())
                .collect(Collectors.toList());
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        // check duplicate
        Map<String, Long> map = scheduleDtoList.stream()
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                })
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        if (map.values().stream().anyMatch(value -> value > 1)) {
            log.error("Schedule is invalid");
            throw new CustomException("Có lịch khám trùng nhau", HttpStatus.BAD_REQUEST.value());
        }
        // check in database
        List<Schedule> schedules = scheduleRepository.findAll(new Date(), doctorIds);
        Set<String> scheduleSet = schedules.stream()
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                })
                .collect(Collectors.toSet());
        scheduleDtoList.stream()
                .filter(item -> item.getId() == null)
                .map(item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                })
                .filter(scheduleSet::contains)
                .findFirst()
                .ifPresent(item -> {
                    log.error("Schedule is invalid");
                    String[] split = item.split("_", -1);
                    throw new CustomException(
                            "Lịch khám: ngày " + split[0] + ", " + nameDepartment + " - " + location + ", phòng "
                                    + split[1] + ", buổi "
                                    + (split[2].equals("MORNING")
                                            ? "sáng"
                                            : "chiều")
                                    + " đã tồn tại",
                            HttpStatus.BAD_REQUEST.value());
                });

        Map<String, String> scheduleMap = scheduleDtoList.stream()
                .filter(item -> item.getId() != null)
                .collect(Collectors.toMap(item -> item.getId(), item -> {
                    String formattedDate = formatter.format(item.getDate());
                    return formattedDate + "_" + item.getClinic() + "_"
                            + item.getTime().toString();
                }));
        Map<String, String> scheduleDBMap = schedules.stream().collect(Collectors.toMap(item -> item.getId(), item -> {
            String formattedDate = formatter.format(item.getDate());
            return formattedDate + "_" + item.getClinic() + "_"
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
                            "Lịch khám: ngày " + split[0] + ", khoa " + nameDepartment + " - " + location + ", phòng "
                                    + split[1] + ", buổi "
                                    + (split[2].equals("MORNING")
                                            ? "sáng"
                                            : "chiều")
                                    + " đã tồn tại",
                            HttpStatus.BAD_REQUEST.value());
                });
    }

    public Set<String> getAllDoctorIdSchedule(Boolean isEqual) {
        log.info("Get all doctor id schedule");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        if (isEqual) {
            return scheduleRepository.getAllDoctorIdByDateGreaterThanOrEqual(calendar.getTime()).stream()
                    .map(item -> item.getDoctorId())
                    .collect(Collectors.toSet());
        }
        calendar.set(Calendar.HOUR_OF_DAY, 7);
        return scheduleRepository.getAllDoctorIdByDateGreaterThan(calendar.getTime()).stream()
                .map(item -> item.getDoctorId())
                .collect(Collectors.toSet());
    }
}
