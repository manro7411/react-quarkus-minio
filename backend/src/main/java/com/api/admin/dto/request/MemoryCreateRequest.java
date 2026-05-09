package com.api.admin.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.UUID;

public class MemoryCreateRequest {

    public UUID mediaObjectId;

    @NotBlank
    public String title;

    public String description;

    public LocalDate memoryDate;

    public Boolean visible = true;

    public Integer sortOrder = 0;
}