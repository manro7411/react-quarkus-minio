package com.api.publicapi.dto.response;

public class PublicFinalSurpriseResponse {

    public String title;
    public String message;
    public String buttonText;
    public String imageUrl;

    public PublicFinalSurpriseResponse() {
    }

    public PublicFinalSurpriseResponse(
            String title,
            String message,
            String buttonText,
            String imageUrl
    ) {
        this.title = title;
        this.message = message;
        this.buttonText = buttonText;
        this.imageUrl = imageUrl;
    }
}