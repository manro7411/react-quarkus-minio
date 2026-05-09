package com.api.site.model;

import com.api.media.model.MediaObject;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gallery_photos")
public class GalleryPhoto extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_profile_id", nullable = false)
    public SiteProfile siteProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_object_id")
    public MediaObject mediaObject;

    @Column
    public String caption;

    @Column(name = "photo_date")
    public LocalDate photoDate;

    @Column(nullable = false)
    public Boolean favorite;

    @Column(nullable = false)
    public Boolean hidden;

    @Column(name = "sort_order", nullable = false)
    public Integer sortOrder;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}