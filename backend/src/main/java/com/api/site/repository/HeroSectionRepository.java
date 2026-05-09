package com.api.site.repository;

import com.api.site.model.HeroSection;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class HeroSectionRepository implements PanacheRepositoryBase<HeroSection, UUID> {

    public Optional<HeroSection> findActiveBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 and active = true",
                siteKey
        ).firstResultOptional();
    }

    public Optional<HeroSection> findBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1",
                siteKey
        ).firstResultOptional();
    }
}