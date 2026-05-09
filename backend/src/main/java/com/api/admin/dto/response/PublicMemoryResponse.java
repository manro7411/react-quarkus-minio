package com.api.publicapi.dto.response;

public class PublicMemoryResponse {

    public String id;
    public String title;
    public String description;
    public String memoryDate;
    public String imageUrl;
    public Integer sortOrder;

    public PublicMemoryResponse() {
    }

    public PublicMemoryResponse(
            String id,
            String title,
            String description,
            String memoryDate,
            String imageUrl,
            Integer sortOrder
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.memoryDate = memoryDate;
        this.imageUrl = imageUrl;
        this.sortOrder = sortOrder;
    }
}