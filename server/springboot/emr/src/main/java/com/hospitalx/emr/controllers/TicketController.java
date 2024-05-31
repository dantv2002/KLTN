package com.hospitalx.emr.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospitalx.emr.common.BaseResponse;
import com.hospitalx.emr.models.dtos.TicketDto;
import com.hospitalx.emr.services.TicketService;

@RestController
@RequestMapping("/api")
public class TicketController {
    @Autowired
    private TicketService ticketService;

    // Booking ticket
    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @GetMapping("/patient/ticket/new/{idDoctor}/{idSchedule}/{idRecord}")
    public ResponseEntity<BaseResponse> create(
            @PathVariable("idRecord") String idRecord,
            @PathVariable("idSchedule") String idSchedule,
            @PathVariable("idDoctor") String idDoctor) {
        ticketService.createTicket(idRecord, idDoctor, idSchedule);
        BaseResponse response = new BaseResponse();
        response.setMessage("Đặt lịch khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_NURSE', 'ROLE_PATIENT')")
    @GetMapping({ "/patient/tickets", "/nurse/tickets" })
    public ResponseEntity<BaseResponse> getAll(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @RequestParam(name = "status", defaultValue = "", required = false) String status,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TicketDto> tickets = ticketService.getAll(keyword, status, pageable);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải danh sách phiếu khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Tickets", tickets.getContent());
                put("CurrentPage", tickets.getNumber());
                put("NumberOfItems", tickets.getNumberOfElements());
                put("TotalItems", tickets.getTotalElements());
                put("TotalPages", tickets.getTotalPages());
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_PATIENT')")
    @GetMapping("/patient/ticket/{id}")
    public ResponseEntity<BaseResponse> get(@PathVariable("id") String id) {
        TicketDto ticketDto = ticketService.get(id);
        BaseResponse response = new BaseResponse();
        response.setMessage("Tải phiếu khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(new HashMap<String, Object>() {
            {
                put("Ticket", ticketDto);
            }
        });
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ROLE_NURSE')")
    @PutMapping("/nurse/ticket")
    public ResponseEntity<BaseResponse> update(@RequestBody Map<String, String> request) {
        String id = request.get("Id");
        TicketDto ticketDto = new TicketDto();
        ticketDto.setId(id);
        ticketService.update(ticketDto);
        BaseResponse response = new BaseResponse();
        response.setMessage("Cập nhật phiếu khám thành công");
        response.setStatus(HttpStatus.OK.value());
        response.setData(null);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
