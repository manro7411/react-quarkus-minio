package com.api.site.repository;

import com.api.site.model.Countdown;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class CountdownRepository implements PanacheRepositoryBase<Countdown, UUID> {

    public Optional<Countdown> findActiveBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 and active = true",
                siteKey
        ).firstResultOptional();
    }

    public Optional<Countdown> findBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1",
                siteKey
        ).firstResultOptional();
    }
}