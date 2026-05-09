package com.api.admin.dto.response;

public class MediaUploadResponse {

    public String mediaObjectId;
    public String bucketName;
    public String objectKey;
    public String originalFilename;
    public String contentType;
    public Long sizeBytes;
    public String imageUrl;

    public MediaUploadResponse() {
    }

    public MediaUploadResponse(
            String mediaObjectId,
            String bucketName,
            String objectKey,
            String originalFilename,
            String contentType,
            Long sizeBytes,
            String imageUrl
    ) {
        this.mediaObjectId = mediaObjectId;
        this.bucketName = bucketName;
        this.objectKey = objectKey;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.imageUrl = imageUrl;
    }
}