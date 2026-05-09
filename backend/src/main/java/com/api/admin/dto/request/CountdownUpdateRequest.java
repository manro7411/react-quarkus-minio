package com.api.admin.dto.request;

import java.time.LocalDateTime;

public class CountdownUpdateRequest {

    public String title;

    public LocalDateTime targetDatetime;

    public Boolean active;
}