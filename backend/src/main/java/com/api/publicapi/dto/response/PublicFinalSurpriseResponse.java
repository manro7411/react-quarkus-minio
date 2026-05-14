package com.api.publicapi.dto.response;

public class PublicFinalSurpriseResponse {

    public String title;
    public String message;
    public String buttonText;
    public Boolean active;
    public String imageUrl;

    public PublicFinalSurpriseResponse() {
    }

    public PublicFinalSurpriseResponse(
            String title,
            String message,
            String buttonText,
            Boolean active,
            String imageUrl
    ) {
        this.title = title;
        this.message = message;
        this.buttonText = buttonText;
        this.active = active;
        this.imageUrl = imageUrl;
    }
}