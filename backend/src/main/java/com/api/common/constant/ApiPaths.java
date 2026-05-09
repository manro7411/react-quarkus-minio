package com.api.common.constant;

public final class ApiPaths {

    private ApiPaths() {
    }

    public static final String API = "/api";

    // Public API
    public static final String PUBLIC = API + "/public";
    public static final String PUBLIC_SITE = PUBLIC + "/site";

    // Admin API
    public static final String ADMIN = API + "/admin";
    public static final String ADMIN_AUTH = ADMIN + "/auth";
    public static final String ADMIN_DASHBOARD = ADMIN + "/dashboard";
    public static final String ADMIN_GALLERY = ADMIN + "/gallery";
    public static final String ADMIN_MEDIA = ADMIN + "/media";

    // Admin Content API
    public static final String ADMIN_HERO = ADMIN + "/hero";
    public static final String ADMIN_COUNTDOWN = ADMIN + "/countdown";
    public static final String ADMIN_LOVE_LETTER = ADMIN + "/love-letter";
    public static final String ADMIN_FINAL_SURPRISE = ADMIN + "/final-surprise";

    // Health API
    public static final String HEALTH = API + "/health";
    public static final String ADMIN_MEMORIES = ADMIN + "/memories";
}