package com.api.site.repository;

import com.api.site.model.GalleryPhoto;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class GalleryPhotoRepository implements PanacheRepositoryBase<GalleryPhoto, UUID> {

    public List<GalleryPhoto> findVisibleBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 and hidden = false order by sortOrder asc, createdAt desc",
                siteKey
        ).list();
    }

    public List<GalleryPhoto> findBySiteKey(String siteKey) {
        return find(
                "siteProfile.siteKey = ?1 order by sortOrder asc, createdAt desc",
                siteKey
        ).list();
    }
}