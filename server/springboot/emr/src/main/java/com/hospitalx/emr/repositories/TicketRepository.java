package com.hospitalx.emr.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.hospitalx.emr.models.entitys.Ticket;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    @Query(value = "{ accountId: ?0, status: {$regex: ?1, $options: 'i'}}")
    Page<Ticket> findAllByIdAndStatus(String accountId, String status, Pageable pageable);

    @Query(value = "{'createdAt': {$gte: ?0, $lt: ?1} }")
    List<Ticket> findAllByCreatedAtBetween(Date startDate, Date endDate);

    @Query(value = "{}", count = true)
    int totalTicket();

    @Query(value = "{ namePatient: { $regex: ?0, $options: 'i' }, status: { $regex: ?1, $options: 'i' } }")
    Page<Ticket> findAllByIdRegex(String id, String status, Pageable pageable);
}
