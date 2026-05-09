package com.api.admin.dto.request;

import java.time.LocalDate;
import java.util.UUID;

public class MemoryUpdateRequest {

    public UUID mediaObjectId;

    public String title;

    public String description;

    public LocalDate memoryDate;

    public Boolean visible;

    public Integer sortOrder;
}