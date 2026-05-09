package com.api.site.repository;

import com.api.site.model.AdminAllowedIp;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class AdminAllowedIpRepository implements PanacheRepositoryBase<AdminAllowedIp, UUID> {

    public Optional<AdminAllowedIp> findActiveByIpAddress(String ipAddress) {
        return find(
                "ipAddress = ?1 and active = true",
                ipAddress
        ).firstResultOptional();
    }

    public boolean isAllowed(String ipAddress) {
        return count(
                "ipAddress = ?1 and active = true",
                ipAddress
        ) > 0;
    }
}