package com.api.admin.service;

import com.api.site.model.AdminRefreshToken;
import com.api.site.model.AdminUser;
import com.api.site.repository.AdminRefreshTokenRepository;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotAuthorizedException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.mindrot.jbcrypt.BCrypt;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Set;

@ApplicationScoped
public class TokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Inject
    AdminRefreshTokenRepository refreshTokenRepository;

    @ConfigProperty(name = "app.auth.jwt-secret")
    String jwtSecret;

    @ConfigProperty(name = "app.auth.access-token-expiration-seconds")
    Long accessTokenExpiresIn;

    @ConfigProperty(name = "app.auth.refresh-token-expiration-seconds")
    Long refreshTokenExpiresIn;

    @ConfigProperty(name = "app.auth.issuer")
    String issuer;

    public String createAccessToken(AdminUser adminUser) {
        Instant now = Instant.now();

        return Jwt.issuer(issuer)
                .subject(adminUser.id.toString())
                .upn(adminUser.email)
                .groups(Set.of(adminUser.role))
                .claim("email", adminUser.email)
                .claim("displayName", adminUser.displayName)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(accessTokenExpiresIn))
                .signWithSecret(jwtSecret);
    }

    @Transactional
    public String createRefreshToken(AdminUser adminUser) {
        String rawToken = generateSecureToken();
        String tokenHash = hashToken(rawToken);

        AdminRefreshToken refreshToken = new AdminRefreshToken();
        refreshToken.adminUser = adminUser;
        refreshToken.tokenHash = tokenHash;
        refreshToken.revoked = false;
        refreshToken.expiresAt = LocalDateTime.now().plusSeconds(refreshTokenExpiresIn);
        refreshToken.createdAt = LocalDateTime.now();

        refreshTokenRepository.persist(refreshToken);

        return rawToken;
    }

    @Transactional
    public AdminUser validateRefreshToken(String rawRefreshToken) {
        AdminRefreshToken refreshToken = refreshTokenRepository.listAll()
                .stream()
                .filter(token -> BCrypt.checkpw(rawRefreshToken, token.tokenHash))
                .findFirst()
                .orElseThrow(() -> new NotAuthorizedException("Invalid refresh token"));

        if (Boolean.TRUE.equals(refreshToken.revoked)) {
            throw new NotAuthorizedException("Refresh token has been revoked");
        }

        if (refreshToken.expiresAt.isBefore(LocalDateTime.now())) {
            throw new NotAuthorizedException("Refresh token has expired");
        }

        if (!Boolean.TRUE.equals(refreshToken.adminUser.active)) {
            throw new NotAuthorizedException("Admin user is inactive");
        }

        return refreshToken.adminUser;
    }

    @Transactional
    public void revokeRefreshToken(String rawRefreshToken) {
        AdminRefreshToken refreshToken = refreshTokenRepository.listAll()
                .stream()
                .filter(token -> BCrypt.checkpw(rawRefreshToken, token.tokenHash))
                .findFirst()
                .orElseThrow(() -> new NotAuthorizedException("Invalid refresh token"));

        refreshToken.revoked = true;
        refreshToken.revokedAt = LocalDateTime.now();
    }

    @Transactional
    public void rotateRefreshToken(String rawRefreshToken) {
        revokeRefreshToken(rawRefreshToken);
    }

    public Long getAccessTokenExpiresIn() {
        return accessTokenExpiresIn;
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[64];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        return BCrypt.hashpw(rawToken, BCrypt.gensalt(12));
    }
}