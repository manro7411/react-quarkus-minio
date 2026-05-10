package com.api.publicapi.dto.response;

import java.util.List;

public class PublicFullSiteResponse {

    public PublicSiteResponse site;
    public PublicHeroResponse hero;
    public PublicCountdownResponse countdown;
    public List<PublicMemoryResponse> memories;
    public List<PublicGalleryPhotoResponse> gallery;
    public PublicLoveLetterResponse loveLetter;
    public PublicFinalSurpriseResponse finalSurprise;

    public PublicFullSiteResponse() {
    }

    public PublicFullSiteResponse(
            PublicSiteResponse site,
            PublicHeroResponse hero,
            PublicCountdownResponse countdown,
            List<PublicMemoryResponse> memories,
            List<PublicGalleryPhotoResponse> gallery,
            PublicLoveLetterResponse loveLetter,
            PublicFinalSurpriseResponse finalSurprise
    ) {
        this.site = site;
        this.hero = hero;
        this.countdown = countdown;
        this.memories = memories;
        this.gallery = gallery;
        this.loveLetter = loveLetter;
        this.finalSurprise = finalSurprise;
    }
}