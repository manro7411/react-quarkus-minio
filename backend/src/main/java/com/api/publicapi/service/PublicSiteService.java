package com.api.publicapi.service;

import com.api.publicapi.dto.response.PublicGalleryPhotoResponse;
import com.api.publicapi.dto.response.PublicSiteResponse;
import com.api.site.model.GalleryPhoto;
import com.api.site.model.SiteProfile;
import com.api.site.repository.GalleryPhotoRepository;
import com.api.site.repository.SiteProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.util.List;

@ApplicationScoped
public class PublicSiteService {

    private static final Logger LOG = Logger.getLogger(PublicSiteService.class);

    @Inject
    SiteProfileRepository siteProfileRepository;

    @Inject
    GalleryPhotoRepository galleryPhotoRepository;

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
}