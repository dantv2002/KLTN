package com.hospitalx.emr.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.common.StaffType;
import com.hospitalx.emr.models.entitys.HealthcareStaff;

public interface HealthcareStaffRepository extends MongoRepository<HealthcareStaff, String> {
        @Query(value = "{ 'identityCard' : ?0, 'deleted' : false}")
        public Optional<HealthcareStaff> findByIdentityCard(String identityCard);

        @Query(value = "{ 'staffType' : ?0, 'fullName' : { $regex: ?1, $options: 'i' }, 'deleted' : false}")
        public Page<HealthcareStaff> findByStaffTypeAndFullNameContainingIgnoreCase(StaffType staffType,
                        String fullName,
                        Pageable pageable);

        @Query(value = "{ 'staffType' : ?0, 'fullName' : { $regex: ?1, $options: 'i' }, 'accountId': { $exists: false }, 'deleted' : false}")
        public Page<HealthcareStaff> findByAllStaffTypeAndFullNameContainingIgnoreCaseAndAccountId(StaffType staffType,
                        String fullName,
                        Pageable pageable);

        @Query(value = "{ 'fullName' : { $regex: ?0, $options: 'i' }, 'deleted' : false}")
        public Page<HealthcareStaff> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);

        @Query(value = "{ 'fullName' : { $regex: ?0, $options: 'i' }, 'accountId': { $exists: false }, 'deleted' : false}")
        public Page<HealthcareStaff> findByFullNameContainingIgnoreCaseAndAccountId(String fullName, Pageable pageable);

        @Query(value = "{ 'staffType' : ?0, 'fullName' : { $regex: ?1, $options: 'i' }, 'title' : { $regex: ?2, $options: 'i' }, 'departmentId' : { $regex: ?3 }, 'gender': { $regex: ?4, $options: 'i' }, 'deleted' : false}")
        public Page<HealthcareStaff> findByDoctor(StaffType staffType, String fullName, String title,
                        String departmentId,
                        String gender, Pageable pageable);

        @Query(value = "{ 'staffType' : ?0, 'fullName' : { $regex: ?1, $options: 'i' }, 'title' : { $regex: ?2, $options: 'i' }, 'departmentId' : { $regex: ?3 }, 'gender': { $regex: ?4, $options: 'i' }, 'schedules': { $exists: true }, 'deleted' : false}")
        public Page<HealthcareStaff> findByDoctorForPatient(StaffType staffType, String fullName, String title,
                        String departmentId,
                        String gender, Pageable pageable);

        @Query(value = "{'departmentId': ?0, 'deleted': false, 'staffType': 'DOCTOR', 'schedules': { $exists: true }}")
        public List<HealthcareStaff> findAllByDepartmentId(String departmentId);

        @Query(value = "{ 'accountId' : ?0, 'deleted' : false}")
        public HealthcareStaff findByAccountId(String accountId);
}
