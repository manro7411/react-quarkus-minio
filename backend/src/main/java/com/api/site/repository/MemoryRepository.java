package com.api.site.repository;

import com.api.site.model.Memory;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class MemoryRepository implements PanacheRepositoryBase<Memory, UUID> {

    public List<Memory> findVisibleBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 and visible = true order by sortOrder asc, memoryDate desc, createdAt desc",
                siteKey
        ).list();
    }

    public List<Memory> findBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 order by sortOrder asc, memoryDate desc, createdAt desc",
                siteKey
        ).list();
    }

    public Optional<Memory> findByIdOptional(UUID id) {
        return find("id", id).firstResultOptional();
    }

    public long countBySiteKey(String siteKey) {
        return count("siteProfile.siteKey", siteKey);
    }
}