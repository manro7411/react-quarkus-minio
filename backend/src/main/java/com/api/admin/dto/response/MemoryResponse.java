package com.api.admin.dto.response;

public class MemoryResponse {

    public String id;
    public String mediaObjectId;
    public String title;
    public String description;
    public String memoryDate;
    public Boolean visible;
    public Integer sortOrder;
    public String imageUrl;
    public String createdAt;
    public String updatedAt;

    public MemoryResponse() {
    }

    public MemoryResponse(
            String id,
            String mediaObjectId,
            String title,
            String description,
            String memoryDate,
            Boolean visible,
            Integer sortOrder,
            String imageUrl,
            String createdAt,
            String updatedAt
    ) {
        this.id = id;
        this.mediaObjectId = mediaObjectId;
        this.title = title;
        this.description = description;
        this.memoryDate = memoryDate;
        this.visible = visible;
        this.sortOrder = sortOrder;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}