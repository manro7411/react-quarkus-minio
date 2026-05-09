package com.api.site.repository;

import com.api.site.model.FinalSurprise;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class FinalSurpriseRepository implements PanacheRepositoryBase<FinalSurprise, UUID> {

    public Optional<FinalSurprise> findActiveBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 and active = true",
                siteKey
        ).firstResultOptional();
    }

    public Optional<FinalSurprise> findBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1",
                siteKey
        ).firstResultOptional();
    }
}