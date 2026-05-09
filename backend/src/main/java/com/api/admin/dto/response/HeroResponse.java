package com.api.admin.dto.response;

public class HeroResponse {

    public String id;
    public String mediaObjectId;
    public String headline;
    public String subtitle;
    public String ctaText;
    public String ctaUrl;
    public Boolean active;
    public String imageUrl;
    public String updatedAt;

    public HeroResponse() {
    }

    public HeroResponse(
            String id,
            String mediaObjectId,
            String headline,
            String subtitle,
            String ctaText,
            String ctaUrl,
            Boolean active,
            String imageUrl,
            String updatedAt
    ) {
        this.id = id;
        this.mediaObjectId = mediaObjectId;
        this.headline = headline;
        this.subtitle = subtitle;
        this.ctaText = ctaText;
        this.ctaUrl = ctaUrl;
        this.active = active;
        this.imageUrl = imageUrl;
        this.updatedAt = updatedAt;
    }
}