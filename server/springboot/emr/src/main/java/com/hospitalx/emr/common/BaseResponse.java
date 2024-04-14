package com.hospitalx.emr.common;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class BaseResponse {
    @JsonProperty("Message")
    private String message;
    @JsonProperty("Status")
    private int status;
    @JsonProperty("Data")
    private Object data;
}