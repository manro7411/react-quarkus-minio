package com.api.admin.dto.response;

public class MediaObjectResponse {

    public String id;
    public String bucketName;
    public String objectKey;
    public String originalFilename;
    public String contentType;
    public Long sizeBytes;
    public String visibility;
    public String imageUrl;
    public String createdAt;

    public MediaObjectResponse() {
    }

    public MediaObjectResponse(
            String id,
            String bucketName,
            String objectKey,
            String originalFilename,
            String contentType,
            Long sizeBytes,
            String visibility,
            String imageUrl,
            String createdAt
    ) {
        this.id = id;
        this.bucketName = bucketName;
        this.objectKey = objectKey;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.visibility = visibility;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }
}