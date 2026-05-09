package com.api.publicapi.dto.response;

public class PublicSiteResponse {

    public String siteKey;
    public String title;
    public String subtitle;
    public String status;

    public PublicSiteResponse() {
    }

    public PublicSiteResponse(
            String siteKey,
            String title,
            String subtitle,
            String status
    ) {
        this.siteKey = siteKey;
        this.title = title;
        this.subtitle = subtitle;
        this.status = status;
    }
}