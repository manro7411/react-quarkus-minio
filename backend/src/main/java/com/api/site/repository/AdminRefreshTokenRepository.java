package com.api.site.repository;

import com.api.site.model.AdminRefreshToken;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class AdminRefreshTokenRepository implements PanacheRepositoryBase<AdminRefreshToken, UUID> {
}