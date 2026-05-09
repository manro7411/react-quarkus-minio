package com.api.site.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_allowed_ips")
public class AdminAllowedIp extends PanacheEntityBase {

    @Id
    @GeneratedValue
    public UUID id;

    @Column(name = "ip_address", nullable = false, unique = true)
    public String ipAddress;

    @Column
    public String description;

    @Column(nullable = false)
    public Boolean active;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;
}