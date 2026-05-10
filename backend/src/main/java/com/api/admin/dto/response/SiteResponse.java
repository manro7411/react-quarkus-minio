package com.api.admin.dto.response;

public class SiteResponse {

    public String id;
    public String siteKey;
    public String title;
    public String subtitle;
    public String status;
    public String createdAt;
    public String updatedAt;

    public SiteResponse() {
    }

    public SiteResponse(
            String id,
            String siteKey,
            String title,
            String subtitle,
            String status,
            String createdAt,
            String updatedAt
    ) {
        this.id = id;
        this.siteKey = siteKey;
        this.title = title;
        this.subtitle = subtitle;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}