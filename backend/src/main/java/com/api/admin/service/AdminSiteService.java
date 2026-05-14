package com.api.admin.service;

import com.api.admin.dto.request.SiteUpdateRequest;
import com.api.admin.dto.response.SiteResponse;
import com.api.site.model.SiteProfile;
import com.api.site.repository.SiteProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;

@ApplicationScoped
public class AdminSiteService {

    private static final Logger LOG = Logger.getLogger(AdminSiteService.class);

    @Inject
    SiteProfileRepository siteProfileRepository;

    @ConfigProperty(name = "app.site.default-key")
    String defaultSiteKey;

    public SiteResponse getSite() {
        SiteProfile siteProfile = findDefaultSiteProfile();

        return toResponse(siteProfile);
    }

    @Transactional
    public SiteResponse updateSite(SiteUpdateRequest request) {
        SiteProfile siteProfile = findDefaultSiteProfile();

        if (request.title != null) {
            siteProfile.title = request.title;
        }

        if (request.subtitle != null) {
            siteProfile.subtitle = request.subtitle;
        }

        if (request.status != null) {
            siteProfile.status = request.status;
        }

        siteProfile.updatedAt = LocalDateTime.now();

        LOG.infof(
                "Updated site profile, siteKey=%s, title=%s, status=%s",
                siteProfile.siteKey,
                siteProfile.title,
                siteProfile.status
        );

        return toResponse(siteProfile);
    }

    private SiteProfile findDefaultSiteProfile() {
        return siteProfileRepository.findBySiteKey(defaultSiteKey)
                .orElseThrow(() -> new NotFoundException("Site not found: " + defaultSiteKey));
    }

    private SiteResponse toResponse(SiteProfile siteProfile) {
        return new SiteResponse(
                siteProfile != null ? siteProfile.getId() : null,
                siteProfile != null ? siteProfile.getTitle() : "",
                siteProfile != null ? siteProfile.getSubtitle() : "",
                siteProfile != null ? siteProfile.getStatus() : "ACTIVE",
                siteProfile != null ? siteProfile.getCreatedAt() : null,
                siteProfile != null ? siteProfile.getUpdatedAt() : null,
                siteProfile != null ? siteProfile.getSomething() : null,
                true
        );
    }
}