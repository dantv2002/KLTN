package com.hospitalx.emr.component;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hospitalx.emr.models.dtos.HealthcareStaffDto;
import com.hospitalx.emr.services.HealthcareStaffService;
import com.hospitalx.emr.services.ScheduleService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ScheduledTasks {
    @Autowired
    private ScheduleService scheduleService;
    @Autowired
    private HealthcareStaffService healthcareStaffService;

    @Scheduled(cron = "0 0 0 * * ?") // second, minute, hour, day, month, weekday
    public void scheduleTask() {
        log.info("Running schedule task");
        List<HealthcareStaffDto> doctor = healthcareStaffService.getAllDoctorSchedule();
        doctor.stream().forEach(d -> {
            if (!scheduleService.isCheckSchedule(d.getId())) {
                d.setIsSchedule(false);
                healthcareStaffService.update(d);
                log.info("Doctor: " + d.getFullName() + ", Id: " + d.getId() + " updated isSchedule is False");
            }
        });
        log.info("Finish schedule task");
    }
}
