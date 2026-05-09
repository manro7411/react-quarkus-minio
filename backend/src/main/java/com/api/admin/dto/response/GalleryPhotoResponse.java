package com.api.admin.dto.response;

public class GalleryPhotoResponse {

    public String id;
    public String mediaObjectId;
    public String caption;
    public String photoDate;
    public Boolean favorite;
    public Boolean hidden;
    public Integer sortOrder;
    public String imageUrl;

    public GalleryPhotoResponse() {
    }

    public GalleryPhotoResponse(
            String id,
            String mediaObjectId,
            String caption,
            String photoDate,
            Boolean favorite,
            Boolean hidden,
            Integer sortOrder,
            String imageUrl
    ) {
        this.id = id;
        this.mediaObjectId = mediaObjectId;
        this.caption = caption;
        this.photoDate = photoDate;
        this.favorite = favorite;
        this.hidden = hidden;
        this.sortOrder = sortOrder;
        this.imageUrl = imageUrl;
    }
}