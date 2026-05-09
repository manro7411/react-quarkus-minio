package com.api.admin.dto.response;

public class DashboardStatsResponse {

    public Long totalMemories;
    public Long totalPhotos;
    public Long favoritePhotos;
    public Long hiddenPhotos;
    public Boolean countdownActive;
    public Boolean finalSurpriseActive;
    public String lastUpdated;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(
            Long totalMemories,
            Long totalPhotos,
            Long favoritePhotos,
            Long hiddenPhotos,
            Boolean countdownActive,
            Boolean finalSurpriseActive,
            String lastUpdated
    ) {
        this.totalMemories = totalMemories;
        this.totalPhotos = totalPhotos;
        this.favoritePhotos = favoritePhotos;
        this.hiddenPhotos = hiddenPhotos;
        this.countdownActive = countdownActive;
        this.finalSurpriseActive = finalSurpriseActive;
        this.lastUpdated = lastUpdated;
    }
}