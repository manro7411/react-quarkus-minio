package com.api.site.repository;

import com.api.site.model.LoveLetter;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class LoveLetterRepository implements PanacheRepositoryBase<LoveLetter, UUID> {

    public Optional<LoveLetter> findActiveBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 and active = true",
                siteKey
        ).firstResultOptional();
    }

    public Optional<LoveLetter> findBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1",
                siteKey
        ).firstResultOptional();
    }
}