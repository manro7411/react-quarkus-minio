package com.api.admin.dto.response;

public class LoveLetterResponse {

    public String id;
    public String title;
    public String body;
    public String signature;
    public Boolean active;
    public String updatedAt;

    public LoveLetterResponse() {
    }

    public LoveLetterResponse(
            String id,
            String title,
            String body,
            String signature,
            Boolean active,
            String updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.signature = signature;
        this.active = active;
        this.updatedAt = updatedAt;
    }
}