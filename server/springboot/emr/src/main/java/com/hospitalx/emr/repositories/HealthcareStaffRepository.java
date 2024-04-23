package com.hospitalx.emr.repositories;

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
    public Page<HealthcareStaff> findByStaffTypeAndFullNameContainingIgnoreCase(StaffType staffType, String fullName,
            Pageable pageable);
    @Query(value = "{ 'fullName' : { $regex: ?0, $options: 'i' }, 'deleted' : false}")
    public Page<HealthcareStaff> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);
}
