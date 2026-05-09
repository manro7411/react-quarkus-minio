package com.api.publicapi.dto.response;

public class PublicGalleryPhotoResponse {

    public String id;
    public String caption;
    public String photoDate;
    public String imageUrl;
    public Boolean favorite;
    public Integer sortOrder;

    public PublicGalleryPhotoResponse() {
    }

    public PublicGalleryPhotoResponse(
            String id,
            String caption,
            String photoDate,
            String imageUrl,
            Boolean favorite,
            Integer sortOrder
    ) {
        this.id = id;
        this.caption = caption;
        this.photoDate = photoDate;
        this.imageUrl = imageUrl;
        this.favorite = favorite;
        this.sortOrder = sortOrder;
    }
}