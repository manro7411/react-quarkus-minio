package com.api.admin.service;

import com.api.admin.dto.request.MemoryCreateRequest;
import com.api.admin.dto.request.MemoryUpdateRequest;
import com.api.admin.dto.response.MemoryResponse;
import com.api.media.model.MediaObject;
import com.api.media.repository.MediaObjectRepository;
import com.api.site.model.Memory;
import com.api.site.model.SiteProfile;
import com.api.site.repository.MemoryRepository;
import com.api.site.repository.SiteProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AdminMemoryService {

    private static final Logger LOG = Logger.getLogger(AdminMemoryService.class);
    private static final String DEFAULT_SITE_KEY = "panpan";

    @Inject
    MemoryRepository memoryRepository;

    @Inject
    SiteProfileRepository siteProfileRepository;

    @Inject
    MediaObjectRepository mediaObjectRepository;

    @ConfigProperty(name = "minio.public-url")
    String minioPublicUrl;

    public List<MemoryResponse> getMemories() {
        return memoryRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MemoryResponse createMemory(MemoryCreateRequest request) {
        SiteProfile siteProfile = siteProfileRepository.findBySiteKey(DEFAULT_SITE_KEY)
                .orElseThrow(() -> new NotFoundException("Site not found: " + DEFAULT_SITE_KEY));

        Memory memory = new Memory();
        memory.siteProfile = siteProfile;
        memory.mediaObject = request.mediaObjectId != null ? findMediaObject(request.mediaObjectId) : null;
        memory.title = request.title;
        memory.description = request.description;
        memory.memoryDate = request.memoryDate;
        memory.visible = request.visible != null ? request.visible : true;
        memory.sortOrder = request.sortOrder != null ? request.sortOrder : 0;
        memory.createdAt = LocalDateTime.now();
        memory.updatedAt = LocalDateTime.now();

        memoryRepository.persist(memory);

        LOG.infof("Created memory, id=%s", memory.id);

        return toResponse(memory);
    }

    @Transactional
    public MemoryResponse updateMemory(UUID id, MemoryUpdateRequest request) {
        Memory memory = memoryRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Memory not found: " + id));

        if (request.mediaObjectId != null) {
            memory.mediaObject = findMediaObject(request.mediaObjectId);
        }

        if (request.title != null) {
            memory.title = request.title;
        }

        if (request.description != null) {
            memory.description = request.description;
        }

        if (request.memoryDate != null) {
            memory.memoryDate = request.memoryDate;
        }

        if (request.visible != null) {
            memory.visible = request.visible;
        }

        if (request.sortOrder != null) {
            memory.sortOrder = request.sortOrder;
        }

        memory.updatedAt = LocalDateTime.now();

        LOG.infof("Updated memory, id=%s", memory.id);

        return toResponse(memory);
    }

    @Transactional
    public void deleteMemory(UUID id) {
        Memory memory = memoryRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Memory not found: " + id));

        memoryRepository.delete(memory);

        LOG.infof("Deleted memory, id=%s", id);
    }

    private MediaObject findMediaObject(UUID mediaObjectId) {
        return mediaObjectRepository.findByIdOptional(mediaObjectId)
                .orElseThrow(() -> new NotFoundException("Media object not found: " + mediaObjectId));
    }

    private MemoryResponse toResponse(Memory memory) {
        String mediaObjectId = null;
        String imageUrl = null;

        if (memory.mediaObject != null) {
            mediaObjectId = memory.mediaObject.id.toString();
            imageUrl = buildImageUrl(memory.mediaObject.bucketName, memory.mediaObject.objectKey);
        }

        return new MemoryResponse(
                memory.id.toString(),
                mediaObjectId,
                memory.title,
                memory.description,
                memory.memoryDate != null ? memory.memoryDate.toString() : null,
                memory.visible,
                memory.sortOrder,
                imageUrl,
                memory.createdAt != null ? memory.createdAt.toString() : null,
                memory.updatedAt != null ? memory.updatedAt.toString() : null
        );
    }

    private String buildImageUrl(String bucketName, String objectKey) {
        return removeTrailingSlash(minioPublicUrl) + "/" + bucketName + "/" + objectKey;
    }

    private String removeTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }

    public MemoryResponse getMemory(UUID id) {
        Memory memory = memoryRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Memory not found: " + id));

        return toResponse(memory);
    }
}