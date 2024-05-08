package com.hospitalx.emr.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hospitalx.emr.models.entitys.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    @Query(value = "{ _id: { $in: ?0 }, status: {$regex: ?1, $options: 'i'}}")
    Page<Record> findAllByIdAndStatus(List<String> ids, String status, Pageable pageable);
}
