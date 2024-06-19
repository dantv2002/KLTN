package com.hospitalx.emr.services;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.entitys.Account;
import com.hospitalx.emr.models.entitys.Medical;
import com.hospitalx.emr.models.entitys.Record;
import com.hospitalx.emr.models.entitys.Ticket;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DashboardService {
    @Autowired
    private RecordService recordService;
    @Autowired
    private MedicalService medicalService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private TicketService ticketService;
    private int count;

    public Map<String, Object> getDashboard(Map<String, String> request) {
        log.info("Get statistical data");
        Date startDate = convertDate(request.get("StartDate"), 0);
        Date endDate = convertDate(request.get("EndDate"), 1);
        if (startDate.after(endDate)) {
            log.error("Start date is after end date");
            throw new CustomException("Ngày bắt đầu không thể sau ngày kết thúc!", HttpStatus.BAD_REQUEST.value());
        }
        Map<String, Object> data = new HashMap<>();
        List<Record> records = recordService.getDashboard(startDate, endDate);
        List<Medical> medicals = medicalService.getDashboard(startDate, endDate);
        List<Account> accounts = accountService.getDashboard(startDate, endDate);
        List<Ticket> tickets = ticketService.getDashboard(startDate, endDate);
        int totalRecord = recordService.totalRecord();
        int totalMedicalNew = medicalService.totalMedicalNew();
        int totalMedicalLocked = medicalService.totalMedicalLocked();
        int totalMedical = totalMedicalNew + totalMedicalLocked;
        int totalMedicalExpired = medicalService.totalMedicalExpired();
        int totalAccount = accountService.totalAccount();
        int totalTicket = ticketService.totalTicket();
        //
        List<Map<String, Object>> recordData = statistical(records, startDate, endDate);
        List<Map<String, Object>> medicalData = statistical(medicals, startDate, endDate);
        List<Map<String, Object>> accountData = statistical(accounts, startDate, endDate);
        List<Map<String, Object>> ticketData = statistical(tickets, startDate, endDate);
        //
        data.put("Record", new HashMap<String, Object>() {
            {
                put("Total", totalRecord);
                put("Statistical", recordData);
            }
        });
        data.put("Medical", new HashMap<String, Object>() {
            {
                put("Total", totalMedical);
                put("New", totalMedicalNew);
                put("Locked", totalMedicalLocked);
                put("Expired", totalMedicalExpired);
                put("Statistical", medicalData);
            }
        });

        data.put("Account", new HashMap<String, Object>() {
            {
                put("Total", totalAccount);
                put("Statistical", accountData);
            }
        });

        data.put("Ticket", new HashMap<String, Object>() {
            {
                put("Total", totalTicket);
                put("Statistical", ticketData);
            }
        });
        log.info("Get statistical data success");
        return data;
    }

    private Date convertDate(String date, int dayPlus) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        try {
            Date value = formatter.parse(date);
            Calendar cal = Calendar.getInstance();
            cal.setTime(value);
            cal.add(Calendar.DAY_OF_MONTH, dayPlus);
            value = cal.getTime();
            return value;
        } catch (Exception e) {
            log.error("Convert date error: " + e.getMessage());
            throw new CustomException("Lỗi chuyển đổi ngày tháng!", HttpStatus.BAD_REQUEST.value());
        }
    }

    public <T> List<Map<String, Object>> statistical(List<T> objects, Date startDate, Date endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        Calendar current = Calendar.getInstance();
        current.setTime(startDate);
        Calendar end = Calendar.getInstance();
        end.setTime(endDate);
        end.add(Calendar.DAY_OF_MONTH, -1);
        Calendar temp = Calendar.getInstance();
        while (current.before(end) || current.equals(end)) {
            count = 0;
            objects.stream().forEach(obj -> {
                if (obj instanceof Record) {
                    Record record = (Record) obj;
                    temp.setTime(record.getCreatedAt());
                } else if (obj instanceof Medical) {
                    Medical medical = (Medical) obj;
                    temp.setTime(medical.getCreatedAt());
                } else if (obj instanceof Account) {
                    Account account = (Account) obj;
                    temp.setTime(account.getCreatedAt());
                } else if (obj instanceof Ticket) {
                    Ticket ticket = (Ticket) obj;
                    temp.setTime(ticket.getCreatedAt());
                }
                if (temp.get(Calendar.MONTH) == current.get(Calendar.MONTH)
                        && temp.get(Calendar.YEAR) == current.get(Calendar.YEAR)) {
                    count++;
                }
            });
            Map<String, Object> item = new HashMap<>();
            item.put("Date", (current.get(Calendar.YEAR) + "-" + (current.get(Calendar.MONTH) + 1)));
            item.put("Count", count);
            result.add(item);
            current.add(Calendar.MONTH, 1);
        }
        return result;
    }
}
