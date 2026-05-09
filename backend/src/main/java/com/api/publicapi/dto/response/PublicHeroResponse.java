package com.api.publicapi.dto.response;

public class PublicHeroResponse {

    public String headline;
    public String subtitle;
    public String ctaText;
    public String ctaUrl;
    public String imageUrl;

    public PublicHeroResponse() {
    }

    public PublicHeroResponse(
            String headline,
            String subtitle,
            String ctaText,
            String ctaUrl,
            String imageUrl
    ) {
        this.headline = headline;
        this.subtitle = subtitle;
        this.ctaText = ctaText;
        this.ctaUrl = ctaUrl;
        this.imageUrl = imageUrl;
    }
}