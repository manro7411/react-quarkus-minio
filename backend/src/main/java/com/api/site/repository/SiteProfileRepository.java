package com.api.site.repository;

import com.api.site.model.SiteProfile;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class SiteProfileRepository implements PanacheRepositoryBase<SiteProfile, UUID> {

    public Optional<SiteProfile> findBySiteKey(String siteKey) {
        return find("siteKey", siteKey).firstResultOptional();
    }
}