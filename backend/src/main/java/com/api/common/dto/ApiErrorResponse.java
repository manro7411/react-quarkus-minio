package com.api.common.dto;

public class ApiErrorResponse {

    public int status;
    public String message;
    public String path;
    public String timestamp;

    public ApiErrorResponse() {
    }

    public ApiErrorResponse(
            int status,
            String message,
            String path,
            String timestamp
    ) {
        this.status = status;
        this.message = message;
        this.path = path;
        this.timestamp = timestamp;
    }
}