package com.api.admin.dto.response;

public class CountdownResponse {

    public String id;
    public String title;
    public String targetDatetime;
    public Boolean active;
    public String updatedAt;

    public CountdownResponse() {
    }

    public CountdownResponse(
            String id,
            String title,
            String targetDatetime,
            Boolean active,
            String updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.targetDatetime = targetDatetime;
        this.active = active;
        this.updatedAt = updatedAt;
    }
}