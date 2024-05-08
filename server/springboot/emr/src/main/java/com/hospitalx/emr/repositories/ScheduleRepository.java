package com.hospitalx.emr.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.common.ScheduleTime;
import com.hospitalx.emr.models.entitys.Schedule;

public interface ScheduleRepository extends MongoRepository<Schedule, String> {
    @Query("{ 'doctorId' : ?0, 'date' : { $gt : ?1 } }")
    Page<Schedule> findByAllDoctorId(String doctorId, Date currentDate, Pageable pageable); // Lấy tất cả lịch khám của bác sĩ sau ngày hiện tại
    @Query("{'date' : ?0, 'time': ?1, 'clinic': ?2}")
    List<Schedule> findByAllOfDate(Date date, ScheduleTime time, String clinic); // Lấy tất cả lịch khám của một ngày, một buổi, một phòng
    @Query("{ 'date' : { $gt : ?0 } }")
    List<Schedule> findAll(Date currentDate);
}
