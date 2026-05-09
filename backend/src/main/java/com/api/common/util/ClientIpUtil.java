package com.api.common.util;

import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MultivaluedMap;

public final class ClientIpUtil {

    private ClientIpUtil() {
    }

    public static String extractClientIp(HttpHeaders headers, String remoteAddress) {
        MultivaluedMap<String, String> requestHeaders = headers.getRequestHeaders();

        String xForwardedFor = firstHeader(requestHeaders, "X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = firstHeader(requestHeaders, "X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        String cfConnectingIp = firstHeader(requestHeaders, "CF-Connecting-IP");
        if (cfConnectingIp != null && !cfConnectingIp.isBlank()) {
            return cfConnectingIp.trim();
        }

        return remoteAddress;
    }

    private static String firstHeader(MultivaluedMap<String, String> headers, String name) {
        String value = headers.getFirst(name);

        if (value != null) {
            return value;
        }

        return headers.entrySet()
                .stream()
                .filter(entry -> entry.getKey().equalsIgnoreCase(name))
                .map(entry -> entry.getValue().isEmpty() ? null : entry.getValue().get(0))
                .findFirst()
                .orElse(null);
    }
}