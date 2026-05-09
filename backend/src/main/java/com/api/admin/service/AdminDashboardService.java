package com.api.admin.service;

import com.api.admin.dto.response.DashboardStatsResponse;
import com.api.site.model.Countdown;
import com.api.site.model.FinalSurprise;
import com.api.site.repository.CountdownRepository;
import com.api.site.repository.FinalSurpriseRepository;
import com.api.site.repository.GalleryPhotoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import com.api.publicapi.dto.response.PublicMemoryResponse;
import com.api.site.model.Memory;
import com.api.site.repository.MemoryRepository;
import java.time.LocalDateTime;

@ApplicationScoped
public class AdminDashboardService {

    private static final String DEFAULT_SITE_KEY = "panpan";

    @Inject
    GalleryPhotoRepository galleryPhotoRepository;

    @Inject
    CountdownRepository countdownRepository;

    @Inject
    FinalSurpriseRepository finalSurpriseRepository;

    @Inject
    MemoryRepository memoryRepository;

    public DashboardStatsResponse getStats() {
        long totalPhotos = galleryPhotoRepository.countBySiteKey(DEFAULT_SITE_KEY);
        long favoritePhotos = galleryPhotoRepository.countFavoriteBySiteKey(DEFAULT_SITE_KEY);
        long hiddenPhotos = galleryPhotoRepository.countHiddenBySiteKey(DEFAULT_SITE_KEY);
        long totalMemories = memoryRepository.countBySiteKey(DEFAULT_SITE_KEY);
        Boolean countdownActive = countdownRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .map(countdown -> countdown.active)
                .orElse(false);

        Boolean finalSurpriseActive = finalSurpriseRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .map(finalSurprise -> finalSurprise.active)
                .orElse(false);

        String lastUpdated = resolveLastUpdated();

        return new DashboardStatsResponse(
                totalMemories,
                totalPhotos,
                favoritePhotos,
                hiddenPhotos,
                countdownActive,
                finalSurpriseActive,
                lastUpdated
        );
    }

    private String resolveLastUpdated() {
        return LocalDateTime.now().toString();
    }
}