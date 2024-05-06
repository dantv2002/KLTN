package com.hospitalx.emr.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.common.AuthProvider;
import com.hospitalx.emr.models.entitys.Account;

public interface AccountRepository extends MongoRepository<Account, String> {

    @Query("{ 'email' : ?0, 'authProvider' : ?1 }")
    Optional<Account> findByEmailAndAuthProvider(String email, AuthProvider authProvider);

    // $nor: not or
    @Query("{ 'fullName': { $regex: ?0, $options: 'i' }, $nor: [{ 'role': 'ADMIN' }], 'role': { $regex: ?1, $options: 'i' }, 'deleted': false}")
    Page<Account> findByAllFullNameAndRole(String fullName, String role, Pageable pageable);
}
