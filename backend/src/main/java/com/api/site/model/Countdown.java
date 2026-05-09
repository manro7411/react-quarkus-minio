package com.api.site.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "countdowns")
public class Countdown extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_profile_id", nullable = false)
    public SiteProfile siteProfile;

    @Column(nullable = false)
    public String title;

    @Column(name = "target_datetime", nullable = false)
    public LocalDateTime targetDatetime;

    @Column(nullable = false)
    public Boolean active;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;
}