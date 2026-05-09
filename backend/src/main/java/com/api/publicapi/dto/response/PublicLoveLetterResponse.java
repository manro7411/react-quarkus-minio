package com.api.publicapi.dto.response;

public class PublicLoveLetterResponse {

    public String title;
    public String body;
    public String signature;

    public PublicLoveLetterResponse() {
    }

    public PublicLoveLetterResponse(String title, String body, String signature) {
        this.title = title;
        this.body = body;
        this.signature = signature;
    }
}