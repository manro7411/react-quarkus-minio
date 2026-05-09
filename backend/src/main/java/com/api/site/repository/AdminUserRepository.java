package com.api.site.repository;

import com.api.site.model.AdminUser;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class AdminUserRepository implements PanacheRepositoryBase<AdminUser, UUID> {

    public Optional<AdminUser> findByEmail(String email) {
        return find("lower(email)", email.toLowerCase()).firstResultOptional();
    }
}