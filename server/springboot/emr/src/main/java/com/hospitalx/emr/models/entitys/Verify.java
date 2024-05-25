package com.hospitalx.emr.models.entitys;

import java.util.Date;

import lombok.Data;

@Data
public class Verify {
    private String code;
    private Date expireAt;

    public Verify(String code, Date expireAt) {
        this.code = code;
        this.expireAt = expireAt;
    }
}
