package com.api.admin.dto.request;

import java.util.UUID;

public class HeroUpdateRequest {

    public UUID mediaObjectId;

    public String headline;

    public String subtitle;

    public String ctaText;

    public String ctaUrl;

    public Boolean active;
}