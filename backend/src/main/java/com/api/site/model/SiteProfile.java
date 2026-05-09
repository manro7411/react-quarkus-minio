package com.api.site.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "site_profiles")
public class SiteProfile extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @Column(name = "site_key", nullable = false, unique = true)
    public String siteKey;

    @Column(nullable = false)
    public String title;

    @Column
    public String subtitle;

    @Column(nullable = false)
    public String status;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;
}