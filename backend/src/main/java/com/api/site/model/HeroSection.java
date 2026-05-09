package com.api.site.model;

import com.api.media.model.MediaObject;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "hero_sections")
public class HeroSection extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_profile_id", nullable = false)
    public SiteProfile siteProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_object_id")
    public MediaObject mediaObject;

    @Column(nullable = false)
    public String headline;

    @Column
    public String subtitle;

    @Column(name = "cta_text")
    public String ctaText;

    @Column(name = "cta_url")
    public String ctaUrl;

    @Column(nullable = false)
    public Boolean active;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;
}