package com.api.admin.service;

import com.api.admin.dto.response.MediaObjectResponse;
import com.api.media.model.MediaObject;
import com.api.media.repository.MediaObjectRepository;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AdminMediaService {

    private static final Logger LOG = Logger.getLogger(AdminMediaService.class);

    @Inject
    MediaObjectRepository mediaObjectRepository;

    @Inject
    MinioClient minioClient;

    @ConfigProperty(name = "minio.public-url")
    String minioPublicUrl;

    public List<MediaObjectResponse> getMediaObjects() {
        return mediaObjectRepository.findLatest()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MediaObjectResponse getMediaObject(UUID id) {
        MediaObject mediaObject = findMediaObject(id);
        return toResponse(mediaObject);
    }

    @Transactional
    public void deleteMediaObject(UUID id) {
        MediaObject mediaObject = findMediaObject(id);

        deleteFromMinio(mediaObject);

        mediaObjectRepository.delete(mediaObject);

        LOG.infof(
                "Deleted media object from database, id=%s, bucket=%s, objectKey=%s",
                id,
                mediaObject.bucketName,
                mediaObject.objectKey
        );
    }

    private void deleteFromMinio(MediaObject mediaObject) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(mediaObject.bucketName)
                            .object(mediaObject.objectKey)
                            .build()
            );

            LOG.infof(
                    "Deleted media object from MinIO, id=%s, bucket=%s, objectKey=%s",
                    mediaObject.id,
                    mediaObject.bucketName,
                    mediaObject.objectKey
            );
        } catch (Exception e) {
            LOG.errorf(
                    e,
                    "Failed to delete object from MinIO, id=%s, bucket=%s, objectKey=%s",
                    mediaObject.id,
                    mediaObject.bucketName,
                    mediaObject.objectKey
            );

            throw new RuntimeException("Failed to delete media object from storage", e);
        }
    }

    private MediaObject findMediaObject(UUID id) {
        return mediaObjectRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Media object not found: " + id));
    }

    private MediaObjectResponse toResponse(MediaObject mediaObject) {
        return new MediaObjectResponse(
                mediaObject.id != null ? mediaObject.id.toString() : null,
                mediaObject.bucketName,
                mediaObject.objectKey,
                mediaObject.originalFilename,
                mediaObject.contentType,
                mediaObject.sizeBytes,
                mediaObject.visibility,
                buildImageUrl(mediaObject.bucketName, mediaObject.objectKey),
                mediaObject.createdAt != null ? mediaObject.createdAt.toString() : null
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
}