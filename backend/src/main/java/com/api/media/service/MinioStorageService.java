package com.api.media.service;

import com.api.admin.dto.response.MediaUploadResponse;
import com.api.media.model.MediaObject;
import com.api.media.repository.MediaObjectRepository;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class MinioStorageService {

    private static final Logger LOG = Logger.getLogger(MinioStorageService.class);

    private static final String DEFAULT_FOLDER = "user-portal/gallery";
    private static final String DEFAULT_CONTENT_TYPE = "application/octet-stream";

    @Inject
    MinioClient minioClient;

    @Inject
    MediaObjectRepository mediaObjectRepository;

    @ConfigProperty(name = "minio.bucket")
    String bucketName;

    @ConfigProperty(name = "minio.public-url")
    String minioPublicUrl;

    @Transactional
    public MediaUploadResponse upload(FileUpload fileUpload, String folder) {
        validateFileUpload(fileUpload);

        try {
            ensureBucketExists();

            String originalFilename = sanitizeFilename(fileUpload.fileName());
            String contentType = resolveContentType(fileUpload);
            Long sizeBytes = resolveSize(fileUpload);

            String safeFolder = normalizeFolder(folder);
            String objectKey = safeFolder + "/" + UUID.randomUUID() + "-" + originalFilename;

            LOG.infof(
                    "Uploading media to MinIO, bucket=%s, objectKey=%s, contentType=%s, sizeBytes=%d",
                    bucketName,
                    objectKey,
                    contentType,
                    sizeBytes
            );

            try (InputStream inputStream = Files.newInputStream(fileUpload.uploadedFile())) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
                                .object(objectKey)
                                .stream(inputStream, sizeBytes, -1)
                                .contentType(contentType)
                                .build()
                );
            }

            MediaObject mediaObject = new MediaObject();
            mediaObject.bucketName = bucketName;
            mediaObject.objectKey = objectKey;
            mediaObject.originalFilename = originalFilename;
            mediaObject.contentType = contentType;
            mediaObject.sizeBytes = sizeBytes;
            mediaObject.visibility = "PUBLIC";
            mediaObject.createdAt = LocalDateTime.now();

            mediaObjectRepository.persist(mediaObject);

            String imageUrl = buildImageUrl(bucketName, objectKey);

            LOG.infof("Uploaded media successfully, mediaObjectId=%s, imageUrl=%s", mediaObject.id, imageUrl);

            return new MediaUploadResponse(
                    mediaObject.id.toString(),
                    mediaObject.bucketName,
                    mediaObject.objectKey,
                    mediaObject.originalFilename,
                    mediaObject.contentType,
                    mediaObject.sizeBytes,
                    imageUrl
            );

        } catch (Exception e) {
            LOG.error("Failed to upload media to MinIO", e);
            throw new RuntimeException("Failed to upload media", e);
        }
    }

    private void validateFileUpload(FileUpload fileUpload) {
        if (fileUpload == null) {
            throw new IllegalArgumentException("file is required. Use multipart/form-data with form key 'file'.");
        }

        if (fileUpload.uploadedFile() == null) {
            throw new IllegalArgumentException("uploaded file path is missing.");
        }

        if (fileUpload.fileName() == null || fileUpload.fileName().isBlank()) {
            throw new IllegalArgumentException("original filename is missing.");
        }
    }

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build()
        );

        if (!exists) {
            LOG.infof("Bucket does not exist. Creating bucket=%s", bucketName);

            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
        }
    }

    private String resolveContentType(FileUpload fileUpload) {
        if (fileUpload.contentType() == null || fileUpload.contentType().isBlank()) {
            return DEFAULT_CONTENT_TYPE;
        }

        return fileUpload.contentType();
    }

    private Long resolveSize(FileUpload fileUpload) throws Exception {
        long uploadedSize = fileUpload.size();

        if (uploadedSize > 0) {
            return uploadedSize;
        }

        return Files.size(fileUpload.uploadedFile());
    }
    private String normalizeFolder(String folder) {
        if (folder == null || folder.isBlank()) {
            return DEFAULT_FOLDER;
        }

        String normalized = folder
                .replace("\\", "/")
                .replaceAll("^/+", "")
                .replaceAll("/+$", "")
                .trim();

        if (normalized.isBlank()) {
            return DEFAULT_FOLDER;
        }

        return normalized;
    }

    private String sanitizeFilename(String filename) {
        String sanitized = filename
                .replace("\\", "/");

        int slashIndex = sanitized.lastIndexOf("/");
        if (slashIndex >= 0) {
            sanitized = sanitized.substring(slashIndex + 1);
        }

        sanitized = sanitized
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-zA-Z0-9._-]", "");

        if (sanitized.isBlank()) {
            return "upload.bin";
        }

        return sanitized;
    }

    private String buildImageUrl(String bucketName, String objectKey) {
        return removeTrailingSlash(minioPublicUrl)
                + "/"
                + encodePath(bucketName)
                + "/"
                + encodeObjectKey(objectKey);
    }

    private String removeTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }

    private String encodeObjectKey(String objectKey) {
        String[] parts = objectKey.split("/");

        StringBuilder encoded = new StringBuilder();

        for (int i = 0; i < parts.length; i++) {
            if (i > 0) {
                encoded.append("/");
            }

            encoded.append(encodePath(parts[i]));
        }

        return encoded.toString();
    }

    private String encodePath(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8)
                .replace("+", "%20");
    }
}