package com.api.admin.dto.request;

import java.time.LocalDate;

public class GalleryPhotoUpdateRequest {

    public String caption;

    public LocalDate photoDate;

    public Boolean favorite;

    public Boolean hidden;

    public Integer sortOrder;
}