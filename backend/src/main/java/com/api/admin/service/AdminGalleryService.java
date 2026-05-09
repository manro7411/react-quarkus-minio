package com.api.admin.service;

import com.api.admin.dto.request.GalleryPhotoCreateRequest;
import com.api.admin.dto.response.GalleryPhotoResponse;
import com.api.media.model.MediaObject;
import com.api.media.repository.MediaObjectRepository;
import com.api.site.model.GalleryPhoto;
import com.api.site.model.SiteProfile;
import com.api.site.repository.GalleryPhotoRepository;
import com.api.site.repository.SiteProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import com.api.admin.dto.request.GalleryPhotoUpdateRequest;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class AdminGalleryService {

    private static final Logger LOG = Logger.getLogger(AdminGalleryService.class);

    private static final String DEFAULT_SITE_KEY = "panpan";

    @Inject
    GalleryPhotoRepository galleryPhotoRepository;

    @Inject
    SiteProfileRepository siteProfileRepository;

    @Inject
    MediaObjectRepository mediaObjectRepository;

    @ConfigProperty(name = "minio.public-url")
    String minioPublicUrl;

    public List<GalleryPhotoResponse> getPhotos() {
        return galleryPhotoRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public GalleryPhotoResponse createPhoto(GalleryPhotoCreateRequest request) {
        SiteProfile siteProfile = siteProfileRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseThrow(() -> new NotFoundException("Site not found: " + DEFAULT_SITE_KEY));

        MediaObject mediaObject = mediaObjectRepository.findByIdOptional(request.mediaObjectId)
                .orElseThrow(() -> new NotFoundException("Media object not found: " + request.mediaObjectId));

        GalleryPhoto galleryPhoto = new GalleryPhoto();
        galleryPhoto.siteProfile = siteProfile;
        galleryPhoto.mediaObject = mediaObject;
        galleryPhoto.caption = request.caption;
        galleryPhoto.photoDate = request.photoDate;
        galleryPhoto.favorite = request.favorite != null ? request.favorite : false;
        galleryPhoto.hidden = request.hidden != null ? request.hidden : false;
        galleryPhoto.sortOrder = request.sortOrder != null ? request.sortOrder : 0;
        galleryPhoto.createdAt = LocalDateTime.now();

        galleryPhotoRepository.persist(galleryPhoto);

        LOG.infof(
                "Created gallery photo, id=%s, mediaObjectId=%s",
                galleryPhoto.id,
                mediaObject.id
        );

        return toResponse(galleryPhoto);
    }

    @Transactional
    public GalleryPhotoResponse updatePhoto(UUID id, GalleryPhotoUpdateRequest request) {
        GalleryPhoto galleryPhoto = galleryPhotoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Gallery photo not found: " + id));

        if (request.caption != null) {
            galleryPhoto.caption = request.caption;
        }

        if (request.photoDate != null) {
            galleryPhoto.photoDate = request.photoDate;
        }

        if (request.favorite != null) {
            galleryPhoto.favorite = request.favorite;
        }

        if (request.hidden != null) {
            galleryPhoto.hidden = request.hidden;
        }

        if (request.sortOrder != null) {
            galleryPhoto.sortOrder = request.sortOrder;
        }

        LOG.infof("Updated gallery photo, id=%s", galleryPhoto.id);

        return toResponse(galleryPhoto);
    }

    @Transactional
    public void deletePhoto(UUID id) {
        GalleryPhoto galleryPhoto = galleryPhotoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Gallery photo not found: " + id));

        galleryPhotoRepository.delete(galleryPhoto);

        LOG.infof("Deleted gallery photo, id=%s", id);
    }

    private GalleryPhotoResponse toResponse(GalleryPhoto photo) {
        String mediaObjectId = null;
        String imageUrl = null;

        if (photo.mediaObject != null) {
            mediaObjectId = photo.mediaObject.id.toString();
            imageUrl = buildImageUrl(photo.mediaObject.bucketName, photo.mediaObject.objectKey);
        }

        return new GalleryPhotoResponse(
                photo.id.toString(),
                mediaObjectId,
                photo.caption,
                photo.photoDate != null ? photo.photoDate.toString() : null,
                photo.favorite,
                photo.hidden,
                photo.sortOrder,
                imageUrl
        );
    }

    private String buildImageUrl(String bucketName, String objectKey) {
        return removeTrailingSlash(minioPublicUrl) + "/" + bucketName + "/" + objectKey;
    }

    private String removeTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }
}