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
import jakarta.ws.rs.BadRequestException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.InputStream;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class MinioStorageService {

    private static final Logger LOG = Logger.getLogger(MinioStorageService.class);

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
        validateFile(fileUpload);

        try {
            ensureBucketExists();

            String originalFilename = sanitizeFilename(fileUpload.fileName());
            String contentType = resolveContentType(fileUpload);
            long sizeBytes = fileUpload.size();

            String safeFolder = normalizeFolder(folder);
            String objectKey = safeFolder + "/" + UUID.randomUUID() + "-" + originalFilename;

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

            LOG.infof(
                    "Uploaded media to MinIO, mediaObjectId=%s, objectKey=%s",
                    mediaObject.id,
                    objectKey
            );

            return new MediaUploadResponse(
                    mediaObject.id.toString(),
                    mediaObject.bucketName,
                    mediaObject.objectKey,
                    mediaObject.originalFilename,
                    mediaObject.contentType,
                    mediaObject.sizeBytes,
                    imageUrl
            );

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            LOG.error("Failed to upload media to MinIO", e);
            throw new RuntimeException("Failed to upload media", e);
        }
    }

    private void validateFile(FileUpload fileUpload) {
        if (fileUpload == null) {
            throw new BadRequestException("File is required");
        }

        if (fileUpload.uploadedFile() == null) {
            throw new BadRequestException("Uploaded file path is missing");
        }

        if (fileUpload.fileName() == null || fileUpload.fileName().isBlank()) {
            throw new BadRequestException("Original filename is missing");
        }

        if (fileUpload.size() <= 0) {
            throw new BadRequestException("Uploaded file is empty");
        }
    }

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build()
        );

        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build()
            );

            LOG.infof("Created MinIO bucket, bucket=%s", bucketName);
        }
    }

    private String normalizeFolder(String folder) {
        if (folder == null || folder.isBlank()) {
            return "user-portal/gallery";
        }

        return folder
                .replace("\\", "/")
                .replaceAll("^/+", "")
                .replaceAll("/+$", "");
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "upload.bin";
        }

        return filename
                .replace("\\", "/")
                .substring(filename.replace("\\", "/").lastIndexOf("/") + 1)
                .replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String resolveContentType(FileUpload fileUpload) {
        if (fileUpload.contentType() == null || fileUpload.contentType().isBlank()) {
            return "application/octet-stream";
        }

        return fileUpload.contentType();
    }

    private String buildImageUrl(String bucketName, String objectKey) {
        return removeTrailingSlash(minioPublicUrl) + "/" + bucketName + "/" + objectKey;
    }

    private String removeTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return value.replaceAll("/+$", "");
    }
}