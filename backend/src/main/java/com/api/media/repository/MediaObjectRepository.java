package com.api.media.repository;

import com.api.media.model.MediaObject;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class MediaObjectRepository implements PanacheRepositoryBase<MediaObject, UUID> {

    public Optional<MediaObject> findByIdOptional(UUID id) {
        return find("id", id).firstResultOptional();
    }

    public List<MediaObject> findLatest() {
        return find("order by createdAt desc").list();
    }
}