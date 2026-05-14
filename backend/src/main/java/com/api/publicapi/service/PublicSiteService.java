package com.api.publicapi.service;

import com.api.publicapi.dto.response.PublicCountdownResponse;
import com.api.publicapi.dto.response.PublicFinalSurpriseResponse;
import com.api.publicapi.dto.response.PublicFullSiteResponse;
import com.api.publicapi.dto.response.PublicGalleryPhotoResponse;
import com.api.publicapi.dto.response.PublicHeroResponse;
import com.api.publicapi.dto.response.PublicLoveLetterResponse;
import com.api.publicapi.dto.response.PublicMemoryResponse;
import com.api.publicapi.dto.response.PublicSiteResponse;
import com.api.site.model.Countdown;
import com.api.site.model.FinalSurprise;
import com.api.site.model.GalleryPhoto;
import com.api.site.model.HeroSection;
import com.api.site.model.LoveLetter;
import com.api.site.model.Memory;
import com.api.site.model.SiteProfile;
import com.api.site.repository.CountdownRepository;
import com.api.site.repository.FinalSurpriseRepository;
import com.api.site.repository.GalleryPhotoRepository;
import com.api.site.repository.HeroSectionRepository;
import com.api.site.repository.LoveLetterRepository;
import com.api.site.repository.MemoryRepository;
import com.api.site.repository.SiteProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import java.util.Collections;
import java.util.function.Supplier;
import java.util.List;

@ApplicationScoped
public class PublicSiteService {

    private static final Logger LOG = Logger.getLogger(PublicSiteService.class);

    @Inject
    SiteProfileRepository siteProfileRepository;

    @Inject
    HeroSectionRepository heroSectionRepository;

    @Inject
    CountdownRepository countdownRepository;

    @Inject
    MemoryRepository memoryRepository;

    @Inject
    GalleryPhotoRepository galleryPhotoRepository;

    @Inject
    LoveLetterRepository loveLetterRepository;

    @Inject
    FinalSurpriseRepository finalSurpriseRepository;

    @ConfigProperty(name = "minio.public-url")
    String minioPublicUrl;

    public PublicSiteResponse getSite(String siteKey) {
        LOG.infof("Fetching public site from DB, siteKey=%s", siteKey);

        SiteProfile siteProfile = siteProfileRepository.findBySiteKey(siteKey)
                .orElseThrow(() -> new NotFoundException("Site not found: " + siteKey));

        return new PublicSiteResponse(
                siteProfile.siteKey,
                siteProfile.title,
                siteProfile.subtitle,
                siteProfile.status
        );
    }

    public PublicFullSiteResponse getFullSite(String siteKey) {
        LOG.infof("Fetching full public site from DB, siteKey=%s", siteKey);

        return new PublicFullSiteResponse(
                getSite(siteKey),
                safeGet(() -> getHero(siteKey)),
                safeGet(() -> getCountdown(siteKey)),
                safeList(() -> getMemories(siteKey)),
                safeList(() -> getGallery(siteKey)),
                safeGet(() -> getLoveLetter(siteKey)),
                safeGet(() -> getFinalSurprise(siteKey))
        );
    }

    public PublicHeroResponse getHero(String siteKey) {
        LOG.infof("Fetching public hero from DB, siteKey=%s", siteKey);

        HeroSection hero = heroSectionRepository.findActiveBySiteKey(siteKey)
                .orElseThrow(() -> new NotFoundException("Hero section not found: " + siteKey));

        String imageUrl = null;

        if (hero.mediaObject != null) {
            imageUrl = buildImageUrl(hero.mediaObject.bucketName, hero.mediaObject.objectKey);
        }

        return new PublicHeroResponse(
                hero.headline,
                hero.subtitle,
                hero.ctaText,
                hero.ctaUrl,
                imageUrl
        );
    }

    public PublicCountdownResponse getCountdown(String siteKey) {
        LOG.infof("Fetching public countdown from DB, siteKey=%s", siteKey);

        Countdown countdown = countdownRepository.findActiveBySiteKey(siteKey)
                .orElseThrow(() -> new NotFoundException("Countdown not found: " + siteKey));

        return new PublicCountdownResponse(
                countdown.title,
                countdown.targetDatetime != null ? countdown.targetDatetime.toString() : null
        );
    }

    public List<PublicMemoryResponse> getMemories(String siteKey) {
        LOG.infof("Fetching public memories from DB, siteKey=%s", siteKey);

        return memoryRepository.findVisibleBySiteKey(siteKey)
                .stream()
                .map(this::toMemoryResponse)
                .toList();
    }

    public List<PublicGalleryPhotoResponse> getGallery(String siteKey) {
        LOG.infof("Fetching public gallery from DB, siteKey=%s", siteKey);

        return galleryPhotoRepository.findVisibleBySiteKey(siteKey)
                .stream()
                .map(this::toGalleryPhotoResponse)
                .toList();
    }

    public PublicLoveLetterResponse getLoveLetter(String siteKey) {
        LOG.infof("Fetching public love letter from DB, siteKey=%s", siteKey);

        LoveLetter loveLetter = loveLetterRepository.findActiveBySiteKey(siteKey)
                .orElseThrow(() -> new NotFoundException("Love letter not found: " + siteKey));

        return new PublicLoveLetterResponse(
                loveLetter.title,
                loveLetter.body,
                loveLetter.signature
        );
    }

    public PublicFinalSurpriseResponse getFinalSurprise(String siteKey) {
        LOG.infof("Fetching public final surprise from DB, siteKey=%s", siteKey);

        FinalSurprise finalSurprise = finalSurpriseRepository.findActiveBySiteKey(siteKey)
                .orElseThrow(() -> new NotFoundException("Final surprise not found: " + siteKey));

        String imageUrl = null;

        if (finalSurprise.mediaObject != null) {
            imageUrl = buildImageUrl(finalSurprise.mediaObject.bucketName, finalSurprise.mediaObject.objectKey);
        }

        return new PublicFinalSurpriseResponse(
                finalSurprise.title,
                finalSurprise.message,
                finalSurprise.buttonText,
                Boolean.TRUE.equals(finalSurprise.active),
                imageUrl
        );
    }

    private PublicMemoryResponse toMemoryResponse(Memory memory) {
        String imageUrl = null;

        if (memory.mediaObject != null) {
            imageUrl = buildImageUrl(memory.mediaObject.bucketName, memory.mediaObject.objectKey);
        }

        return new PublicMemoryResponse(
                memory.id != null ? memory.id.toString() : null,
                memory.title,
                memory.description,
                memory.memoryDate != null ? memory.memoryDate.toString() : null,
                imageUrl,
                memory.sortOrder
        );
    }

    private PublicGalleryPhotoResponse toGalleryPhotoResponse(GalleryPhoto photo) {
        String imageUrl = null;

        if (photo.mediaObject != null) {
            imageUrl = buildImageUrl(photo.mediaObject.bucketName, photo.mediaObject.objectKey);
        }

        return new PublicGalleryPhotoResponse(
                photo.id != null ? photo.id.toString() : null,
                photo.caption,
                photo.photoDate != null ? photo.photoDate.toString() : null,
                imageUrl,
                photo.favorite,
                photo.sortOrder
        );
    }

    private String buildImageUrl(String bucketName, String objectKey) {
        if (bucketName == null || bucketName.isBlank()) {
            return null;
        }

        if (objectKey == null || objectKey.isBlank()) {
            return null;
        }

        return removeTrailingSlash(minioPublicUrl) + "/" + bucketName + "/" + objectKey;
    }

    private String removeTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return value.replaceAll("/+$", "");
    }

    private <T> T safeGet(Supplier<T> supplier) {
        try {
            return supplier.get();
        } catch (NotFoundException e) {
            LOG.warnf("Optional public section not found: %s", e.getMessage());
            return null;
        }
    }

    private <T> List<T> safeList(Supplier<List<T>> supplier) {
        try {
            return supplier.get();
        } catch (NotFoundException e) {
            LOG.warnf("Optional public list section not found: %s", e.getMessage());
            return Collections.emptyList();
        }
    }
}