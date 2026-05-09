package com.api.publicapi.service;

import com.api.publicapi.dto.response.PublicCountdownResponse;
import com.api.publicapi.dto.response.PublicFinalSurpriseResponse;
import com.api.publicapi.dto.response.PublicGalleryPhotoResponse;
import com.api.publicapi.dto.response.PublicHeroResponse;
import com.api.publicapi.dto.response.PublicLoveLetterResponse;
import com.api.publicapi.dto.response.PublicSiteResponse;
import com.api.site.model.Countdown;
import com.api.site.model.FinalSurprise;
import com.api.site.model.GalleryPhoto;
import com.api.site.model.HeroSection;
import com.api.site.model.LoveLetter;
import com.api.site.model.SiteProfile;
import com.api.site.repository.CountdownRepository;
import com.api.site.repository.FinalSurpriseRepository;
import com.api.site.repository.GalleryPhotoRepository;
import com.api.site.repository.HeroSectionRepository;
import com.api.site.repository.LoveLetterRepository;
import com.api.site.repository.SiteProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import com.api.publicapi.dto.response.PublicMemoryResponse;
import com.api.site.model.Memory;
import com.api.site.repository.MemoryRepository;
import java.util.List;

@ApplicationScoped
public class PublicSiteService {

    private static final Logger LOG = Logger.getLogger(PublicSiteService.class);

    @Inject
    SiteProfileRepository siteProfileRepository;

    @Inject
    GalleryPhotoRepository galleryPhotoRepository;

    @Inject
    HeroSectionRepository heroSectionRepository;

    @Inject
    CountdownRepository countdownRepository;

    @Inject
    LoveLetterRepository loveLetterRepository;

    @Inject
    FinalSurpriseRepository finalSurpriseRepository;

    @Inject
    MemoryRepository memoryRepository;

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
                imageUrl
        );
    }

    public List<PublicGalleryPhotoResponse> getGallery(String siteKey) {
        LOG.infof("Fetching public gallery from DB, siteKey=%s", siteKey);

        return galleryPhotoRepository.findVisibleBySiteKey(siteKey)
                .stream()
                .map(this::toGalleryPhotoResponse)
                .toList();
    }

    private PublicGalleryPhotoResponse toGalleryPhotoResponse(GalleryPhoto photo) {
        String imageUrl = null;

        if (photo.mediaObject != null) {
            imageUrl = buildImageUrl(photo.mediaObject.bucketName, photo.mediaObject.objectKey);
        }

        return new PublicGalleryPhotoResponse(
                photo.id.toString(),
                photo.caption,
                photo.photoDate != null ? photo.photoDate.toString() : null,
                imageUrl,
                photo.favorite,
                photo.sortOrder
        );
    }

    private String buildImageUrl(String bucketName, String objectKey) {
        return removeTrailingSlash(minioPublicUrl) + "/" + bucketName + "/" + objectKey;
    }

    private String removeTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }

    public List<PublicMemoryResponse> getMemories(String siteKey) {
        LOG.infof("Fetching public memories from DB, siteKey=%s", siteKey);

        return memoryRepository.findVisibleBySiteKey(siteKey)
                .stream()
                .map(this::toMemoryResponse)
                .toList();
    }

    private PublicMemoryResponse toMemoryResponse(Memory memory) {
        String imageUrl = null;

        if (memory.mediaObject != null) {
            imageUrl = buildImageUrl(memory.mediaObject.bucketName, memory.mediaObject.objectKey);
        }

        return new PublicMemoryResponse(
                memory.id.toString(),
                memory.title,
                memory.description,
                memory.memoryDate != null ? memory.memoryDate.toString() : null,
                imageUrl,
                memory.sortOrder
        );
    }
}