package com.hospitalx.emr.models.entitys;

import java.time.Instant;

import lombok.Data;

@Data
public class Verify {
    private String code;
    private Instant expireAt;

    public Verify(String code, Instant expireAt) {
        this.code = code;
        this.expireAt = expireAt;
    }
}
