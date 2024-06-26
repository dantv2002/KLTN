package com.hospitalx.emr.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.hospitalx.emr.common.ScheduleTime;
import com.hospitalx.emr.models.entitys.Schedule;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String> {
    @Query(value = "{ 'doctorId' : ?0, 'date' : { $gt : ?1 } }")
    Page<Schedule> findByAllDoctorId(String doctorId, Date currentDate, Pageable pageable); // Lấy tất cả lịch khám của
                                                                                            // bác sĩ sau ngày hiện tại

    @Query(value = "{'date' : ?0, 'time': ?1, 'clinic': ?2}")
    List<Schedule> findByAllOfDate(Date date, ScheduleTime time, String clinic); // Lấy tất cả lịch khám của một ngày,
                                                                                 // một buổi, một phòng

    @Query(value = "{ 'date' : { $gt : ?0 }, 'doctorId' : { $in: ?1 } }")
    List<Schedule> findAll(Date currentDate, List<String> doctorIds);

    @Query(value = "{ 'doctorId' : { $in: ?0 }, 'time': ?1, 'date' : { $gte : ?2, $lte : ?3 } }")
    List<Schedule> findAllTimeDoctor(List<String> doctorIds, ScheduleTime time, Date startDate, Date endDate);

    @Query(value = "{ 'doctorId' : ?0, 'date' : { $gte : ?1, $lte : ?2 } }")
    List<Schedule> findAllTimeDoctor(String doctorId, Date startDate, Date endDate);

    @Query(value = "{'date' : { $gte : ?0 } }")
    List<Schedule> getAllDoctorIdByDateGreaterThanOrEqual(Date date);

    @Query(value = "{'date' : { $gt : ?0 } }")
    List<Schedule> getAllDoctorIdByDateGreaterThan(Date date);

    @Query(value = "{'date' : { $lt: ?0 } }")
    List<Schedule> getAllByDateLessThan(Date date);
}
