package com.api.site.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_refresh_tokens")
public class AdminRefreshToken extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id", nullable = false)
    public AdminUser adminUser;

    @Column(name = "token_hash", nullable = false, unique = true)
    public String tokenHash;

    @Column(nullable = false)
    public Boolean revoked;

    @Column(name = "expires_at", nullable = false)
    public LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "revoked_at")
    public LocalDateTime revokedAt;
}