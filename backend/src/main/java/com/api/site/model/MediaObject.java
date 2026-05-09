package com.api.media.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_objects")
public class MediaObject extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @Column(name = "bucket_name", nullable = false)
    public String bucketName;

    @Column(name = "object_key", nullable = false, unique = true)
    public String objectKey;

    @Column(name = "original_filename")
    public String originalFilename;

    @Column(name = "content_type")
    public String contentType;

    @Column(name = "size_bytes")
    public Long sizeBytes;

    @Column
    public String checksum;

    @Column(nullable = false)
    public String visibility;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}