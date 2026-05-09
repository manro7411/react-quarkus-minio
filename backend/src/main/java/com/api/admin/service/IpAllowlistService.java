package com.api.admin.service;

import com.api.site.repository.AdminAllowedIpRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

@ApplicationScoped
public class IpAllowlistService {

    private static final Logger LOG = Logger.getLogger(IpAllowlistService.class);

    @Inject
    AdminAllowedIpRepository adminAllowedIpRepository;

    @ConfigProperty(name = "app.admin-login.ip-allowlist.enabled", defaultValue = "true")
    Boolean enabled;

    public boolean isAllowed(String clientIp) {
        if (!Boolean.TRUE.equals(enabled)) {
            LOG.debugf(
                    "Admin login IP allowlist is disabled. Bypassing IP check, clientIp=%s",
                    clientIp
            );
            return true;
        }

        if (clientIp == null || clientIp.isBlank()) {
            LOG.warn("Admin login blocked because client IP is missing");
            return false;
        }

        String normalizedIp = normalizeIp(clientIp);

        if (normalizedIp == null || normalizedIp.isBlank()) {
            LOG.warnf("Admin login blocked because normalized client IP is invalid, rawClientIp=%s", clientIp);
            return false;
        }

        try {
            boolean allowed = adminAllowedIpRepository.isAllowed(normalizedIp);

            if (!allowed) {
                LOG.warnf(
                        "Admin login blocked by DB IP allowlist, rawClientIp=%s, normalizedClientIp=%s",
                        clientIp,
                        normalizedIp
                );
            } else {
                LOG.infof(
                        "Admin login IP allowed, rawClientIp=%s, normalizedClientIp=%s",
                        clientIp,
                        normalizedIp
                );
            }

            return allowed;

        } catch (Exception e) {
            LOG.errorf(
                    e,
                    "Failed to check admin login IP allowlist, rawClientIp=%s, normalizedClientIp=%s",
                    clientIp,
                    normalizedIp
            );

            return false;
        }
    }

    private String normalizeIp(String ip) {
        if (ip == null) {
            return null;
        }

        String normalized = ip.trim();

        if (normalized.isBlank()) {
            return null;
        }

        // X-Forwarded-For may contain multiple values.
        // Example: "203.0.113.10, 10.0.0.1"
        if (normalized.contains(",")) {
            normalized = normalized.split(",")[0].trim();
        }

        // Remove optional port from IPv4.
        // Example: "127.0.0.1:54321" -> "127.0.0.1"
        if (isIpv4WithPort(normalized)) {
            normalized = normalized.substring(0, normalized.lastIndexOf(":"));
        }

        // Normalize IPv6 localhost.
        if ("::1".equals(normalized)) {
            return "0:0:0:0:0:0:0:1";
        }

        // Handle IPv4 mapped IPv6.
        // Example: "::ffff:127.0.0.1" -> "127.0.0.1"
        if (normalized.startsWith("::ffff:")) {
            return normalized.substring("::ffff:".length());
        }

        return normalized;
    }

    private boolean isIpv4WithPort(String value) {
        if (value == null) {
            return false;
        }

        int lastColonIndex = value.lastIndexOf(":");

        if (lastColonIndex < 0) {
            return false;
        }

        String ipPart = value.substring(0, lastColonIndex);
        String portPart = value.substring(lastColonIndex + 1);

        return ipPart.matches("\\d+\\.\\d+\\.\\d+\\.\\d+")
                && portPart.matches("\\d+");
    }
}