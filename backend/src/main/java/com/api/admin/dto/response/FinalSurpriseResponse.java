package com.api.admin.dto.response;

public class FinalSurpriseResponse {

    public String id;
    public String mediaObjectId;
    public String title;
    public String message;
    public String buttonText;
    public Boolean active;
    public String imageUrl;
    public String updatedAt;

    public FinalSurpriseResponse() {
    }

    public FinalSurpriseResponse(
            String id,
            String mediaObjectId,
            String title,
            String message,
            String buttonText,
            Boolean active,
            String imageUrl,
            String updatedAt
    ) {
        this.id = id;
        this.mediaObjectId = mediaObjectId;
        this.title = title;
        this.message = message;
        this.buttonText = buttonText;
        this.active = active;
        this.imageUrl = imageUrl;
        this.updatedAt = updatedAt;
    }
}