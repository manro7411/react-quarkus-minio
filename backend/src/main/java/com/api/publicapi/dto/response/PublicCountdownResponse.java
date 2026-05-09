package com.api.publicapi.dto.response;

public class PublicCountdownResponse {

    public String title;
    public String targetDatetime;

    public PublicCountdownResponse() {
    }

    public PublicCountdownResponse(String title, String targetDatetime) {
        this.title = title;
        this.targetDatetime = targetDatetime;
    }
}