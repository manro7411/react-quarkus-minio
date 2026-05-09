package com.api.admin.service;

import com.api.admin.dto.request.CountdownUpdateRequest;
import com.api.admin.dto.request.FinalSurpriseUpdateRequest;
import com.api.admin.dto.request.HeroUpdateRequest;
import com.api.admin.dto.request.LoveLetterUpdateRequest;
import com.api.admin.dto.response.CountdownResponse;
import com.api.admin.dto.response.FinalSurpriseResponse;
import com.api.admin.dto.response.HeroResponse;
import com.api.admin.dto.response.LoveLetterResponse;
import com.api.media.model.MediaObject;
import com.api.media.repository.MediaObjectRepository;
import com.api.site.model.Countdown;
import com.api.site.model.FinalSurprise;
import com.api.site.model.HeroSection;
import com.api.site.model.LoveLetter;
import com.api.site.model.SiteProfile;
import com.api.site.repository.CountdownRepository;
import com.api.site.repository.FinalSurpriseRepository;
import com.api.site.repository.HeroSectionRepository;
import com.api.site.repository.LoveLetterRepository;
import com.api.site.repository.SiteProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class AdminContentService {

    private static final Logger LOG = Logger.getLogger(AdminContentService.class);
    private static final String DEFAULT_SITE_KEY = "panpan";

    @Inject
    SiteProfileRepository siteProfileRepository;

    @Inject
    MediaObjectRepository mediaObjectRepository;

    @Inject
    HeroSectionRepository heroSectionRepository;

    @Inject
    CountdownRepository countdownRepository;

    @Inject
    LoveLetterRepository loveLetterRepository;

    @Inject
    FinalSurpriseRepository finalSurpriseRepository;

    @ConfigProperty(name = "minio.public-url")
    String minioPublicUrl;

    public HeroResponse getHero() {
        HeroSection hero = heroSectionRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseThrow(() -> new NotFoundException("Hero section not found"));

        return toHeroResponse(hero);
    }

    @Transactional
    public HeroResponse updateHero(HeroUpdateRequest request) {
        HeroSection hero = heroSectionRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseGet(() -> createDefaultHero(getDefaultSiteProfile()));

        if (request.mediaObjectId != null) {
            hero.mediaObject = findMediaObject(request.mediaObjectId);
        }

        if (request.headline != null) {
            hero.headline = request.headline;
        }

        if (request.subtitle != null) {
            hero.subtitle = request.subtitle;
        }

        if (request.ctaText != null) {
            hero.ctaText = request.ctaText;
        }

        if (request.ctaUrl != null) {
            hero.ctaUrl = request.ctaUrl;
        }

        if (request.active != null) {
            hero.active = request.active;
        }

        hero.updatedAt = LocalDateTime.now();

        LOG.infof("Updated hero section, id=%s", hero.id);

        return toHeroResponse(hero);
    }

    public CountdownResponse getCountdown() {
        Countdown countdown = countdownRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseThrow(() -> new NotFoundException("Countdown not found"));

        return toCountdownResponse(countdown);
    }

    @Transactional
    public CountdownResponse updateCountdown(CountdownUpdateRequest request) {
        Countdown countdown = countdownRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseGet(() -> createDefaultCountdown(getDefaultSiteProfile()));

        if (request.title != null) {
            countdown.title = request.title;
        }

        if (request.targetDatetime != null) {
            countdown.targetDatetime = request.targetDatetime;
        }

        if (request.active != null) {
            countdown.active = request.active;
        }

        countdown.updatedAt = LocalDateTime.now();

        LOG.infof("Updated countdown, id=%s", countdown.id);

        return toCountdownResponse(countdown);
    }

    public LoveLetterResponse getLoveLetter() {
        LoveLetter loveLetter = loveLetterRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseThrow(() -> new NotFoundException("Love letter not found"));

        return toLoveLetterResponse(loveLetter);
    }

    @Transactional
    public LoveLetterResponse updateLoveLetter(LoveLetterUpdateRequest request) {
        LoveLetter loveLetter = loveLetterRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseGet(() -> createDefaultLoveLetter(getDefaultSiteProfile()));

        if (request.title != null) {
            loveLetter.title = request.title;
        }

        if (request.body != null) {
            loveLetter.body = request.body;
        }

        if (request.signature != null) {
            loveLetter.signature = request.signature;
        }

        if (request.active != null) {
            loveLetter.active = request.active;
        }

        loveLetter.updatedAt = LocalDateTime.now();

        LOG.infof("Updated love letter, id=%s", loveLetter.id);

        return toLoveLetterResponse(loveLetter);
    }

    public FinalSurpriseResponse getFinalSurprise() {
        FinalSurprise finalSurprise = finalSurpriseRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseThrow(() -> new NotFoundException("Final surprise not found"));

        return toFinalSurpriseResponse(finalSurprise);
    }

    @Transactional
    public FinalSurpriseResponse updateFinalSurprise(FinalSurpriseUpdateRequest request) {
        FinalSurprise finalSurprise = finalSurpriseRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseGet(() -> createDefaultFinalSurprise(getDefaultSiteProfile()));

        if (request.mediaObjectId != null) {
            finalSurprise.mediaObject = findMediaObject(request.mediaObjectId);
        }

        if (request.title != null) {
            finalSurprise.title = request.title;
        }

        if (request.message != null) {
            finalSurprise.message = request.message;
        }

        if (request.buttonText != null) {
            finalSurprise.buttonText = request.buttonText;
        }

        if (request.active != null) {
            finalSurprise.active = request.active;
        }

        finalSurprise.updatedAt = LocalDateTime.now();

        LOG.infof("Updated final surprise, id=%s", finalSurprise.id);

        return toFinalSurpriseResponse(finalSurprise);
    }

    private SiteProfile getDefaultSiteProfile() {
        return siteProfileRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseThrow(() -> new NotFoundException("Site not found: " + DEFAULT_SITE_KEY));
    }

    private MediaObject findMediaObject(UUID mediaObjectId) {
        return mediaObjectRepository.findByIdOptional(mediaObjectId)
                .orElseThrow(() -> new NotFoundException("Media object not found: " + mediaObjectId));
    }

    private HeroSection createDefaultHero(SiteProfile siteProfile) {
        HeroSection hero = new HeroSection();
        hero.siteProfile = siteProfile;
        hero.headline = "I have something special for you";
        hero.subtitle = "A little surprise made just for you";
        hero.ctaText = "Open Your Surprise";
        hero.ctaUrl = "#surprise";
        hero.active = true;
        hero.updatedAt = LocalDateTime.now();
        heroSectionRepository.persist(hero);
        return hero;
    }

    private Countdown createDefaultCountdown(SiteProfile siteProfile) {
        Countdown countdown = new Countdown();
        countdown.siteProfile = siteProfile;
        countdown.title = "Something special is coming";
        countdown.targetDatetime = LocalDateTime.now().plusDays(23);
        countdown.active = true;
        countdown.updatedAt = LocalDateTime.now();
        countdownRepository.persist(countdown);
        return countdown;
    }

    private LoveLetter createDefaultLoveLetter(SiteProfile siteProfile) {
        LoveLetter loveLetter = new LoveLetter();
        loveLetter.siteProfile = siteProfile;
        loveLetter.title = "A Letter For You";
        loveLetter.body = "From the moment we met, my world became brighter.";
        loveLetter.signature = "Forever yours";
        loveLetter.active = true;
        loveLetter.updatedAt = LocalDateTime.now();
        loveLetterRepository.persist(loveLetter);
        return loveLetter;
    }

    private FinalSurprise createDefaultFinalSurprise(SiteProfile siteProfile) {
        FinalSurprise finalSurprise = new FinalSurprise();
        finalSurprise.siteProfile = siteProfile;
        finalSurprise.title = "Are you ready for your final surprise?";
        finalSurprise.message = "The best is yet to come...";
        finalSurprise.buttonText = "Reveal Final Surprise";
        finalSurprise.active = true;
        finalSurprise.updatedAt = LocalDateTime.now();
        finalSurpriseRepository.persist(finalSurprise);
        return finalSurprise;
    }

    private HeroResponse toHeroResponse(HeroSection hero) {
        String mediaObjectId = null;
        String imageUrl = null;

        if (hero.mediaObject != null) {
            mediaObjectId = hero.mediaObject.id.toString();
            imageUrl = buildImageUrl(hero.mediaObject.bucketName, hero.mediaObject.objectKey);
        }

        return new HeroResponse(
                hero.id.toString(),
                mediaObjectId,
                hero.headline,
                hero.subtitle,
                hero.ctaText,
                hero.ctaUrl,
                hero.active,
                imageUrl,
                hero.updatedAt != null ? hero.updatedAt.toString() : null
        );
    }

    private CountdownResponse toCountdownResponse(Countdown countdown) {
        return new CountdownResponse(
                countdown.id.toString(),
                countdown.title,
                countdown.targetDatetime != null ? countdown.targetDatetime.toString() : null,
                countdown.active,
                countdown.updatedAt != null ? countdown.updatedAt.toString() : null
        );
    }

    private LoveLetterResponse toLoveLetterResponse(LoveLetter loveLetter) {
        return new LoveLetterResponse(
                loveLetter.id.toString(),
                loveLetter.title,
                loveLetter.body,
                loveLetter.signature,
                loveLetter.active,
                loveLetter.updatedAt != null ? loveLetter.updatedAt.toString() : null
        );
    }

    private FinalSurpriseResponse toFinalSurpriseResponse(FinalSurprise finalSurprise) {
        String mediaObjectId = null;
        String imageUrl = null;

        if (finalSurprise.mediaObject != null) {
            mediaObjectId = finalSurprise.mediaObject.id.toString();
            imageUrl = buildImageUrl(finalSurprise.mediaObject.bucketName, finalSurprise.mediaObject.objectKey);
        }

        return new FinalSurpriseResponse(
                finalSurprise.id.toString(),
                mediaObjectId,
                finalSurprise.title,
                finalSurprise.message,
                finalSurprise.buttonText,
                finalSurprise.active,
                imageUrl,
                finalSurprise.updatedAt != null ? finalSurprise.updatedAt.toString() : null
        );
    }

    private String buildImageUrl(String bucketName, String objectKey) {
        return removeTrailingSlash(minioPublicUrl) + "/" + bucketName + "/" + objectKey;
    }

    private String removeTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }
}