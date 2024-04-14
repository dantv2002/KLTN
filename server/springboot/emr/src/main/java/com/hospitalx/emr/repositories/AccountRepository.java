package com.hospitalx.emr.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hospitalx.emr.common.AuthProvider;
import com.hospitalx.emr.models.entitys.Account;

public interface AccountRepository extends MongoRepository<Account, String> {

    Optional<Account> findByEmailAndAuthProvider(String email, AuthProvider authProvider);
}
