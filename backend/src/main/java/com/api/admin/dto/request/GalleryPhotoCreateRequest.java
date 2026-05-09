package com.api.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class GalleryPhotoCreateRequest {

    @NotNull
    public UUID mediaObjectId;

    @NotBlank
    public String caption;

    public LocalDate photoDate;

    public Boolean favorite = false;

    public Boolean hidden = false;

    public Integer sortOrder = 0;
}