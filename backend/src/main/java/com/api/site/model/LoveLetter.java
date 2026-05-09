package com.api.site.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "love_letters")
public class LoveLetter extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_profile_id", nullable = false)
    public SiteProfile siteProfile;

    @Column(nullable = false)
    public String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String body;

    @Column
    public String signature;

    @Column(nullable = false)
    public Boolean active;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;
}