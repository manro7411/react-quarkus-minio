package com.api.admin.service;

import com.api.admin.dto.request.LoginRequest;
import com.api.admin.dto.request.LogoutRequest;
import com.api.admin.dto.request.RefreshTokenRequest;
import com.api.admin.dto.request.RegisterRequest;
import com.api.admin.dto.response.LoginResponse;
import com.api.admin.dto.response.RegisterResponse;
import com.api.site.model.AdminUser;
import com.api.site.repository.AdminUserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAuthorizedException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDateTime;

@ApplicationScoped
public class AdminAuthService {

    private static final Logger LOG = Logger.getLogger(AdminAuthService.class);

    @Inject
    AdminUserRepository adminUserRepository;

    @Inject
    TokenService tokenService;

    @Inject
    IpAllowlistService ipAllowlistService;

    @ConfigProperty(name = "app.admin-register.enabled", defaultValue = "true")
    Boolean registerEnabled;

    @ConfigProperty(name = "app.admin-register.setup-key", defaultValue = "dev-register-key")
    String registerSetupKey;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        validateRegisterRequest(request);
        validateRegisterSetupKey(request);

        String email = normalizeEmail(request.email);
        LocalDateTime now = LocalDateTime.now();

        AdminUser adminUser = adminUserRepository.findByEmail(email)
                .orElseGet(AdminUser::new);

        boolean isNewUser = adminUser.id == null;

        adminUser.email = email;
        adminUser.passwordHash = BCrypt.hashpw(request.password, BCrypt.gensalt(10));
        adminUser.displayName = normalizeOrDefault(request.displayName, "Admin");
        adminUser.role = normalizeOrDefault(request.role, "SUPER_ADMIN");
        adminUser.active = true;

        if (isNewUser) {
            adminUser.createdAt = now;
            adminUser.updatedAt = now;
            adminUserRepository.persist(adminUser);
        } else {
            adminUser.updatedAt = now;
        }

        LOG.infof(
                "Admin user registered/updated, email=%s, role=%s, isNewUser=%s",
                adminUser.email,
                adminUser.role,
                isNewUser
        );

        return new RegisterResponse(
                adminUser.id.toString(),
                adminUser.email,
                adminUser.displayName,
                adminUser.role,
                adminUser.active
        );
    }

    @Transactional
    public LoginResponse login(LoginRequest request, String clientIp) {
        validateLoginRequest(request);

        String email = normalizeEmail(request.email);

        if (!isClientIpAllowed(clientIp)) {
            LOG.warnf(
                    "Admin login blocked by IP allowlist, email=%s, clientIp=%s",
                    email,
                    clientIp
            );

            throw new ForbiddenException(
                    "This IP address is not allowed to login to admin dashboard"
            );
        }

        AdminUser adminUser = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> {
                    LOG.warnf(
                            "Admin login failed because user was not found, email=%s, clientIp=%s",
                            email,
                            clientIp
                    );

                    return new NotAuthorizedException("Invalid email or password");
                });

        if (!Boolean.TRUE.equals(adminUser.active)) {
            LOG.warnf(
                    "Inactive admin login attempt, email=%s, clientIp=%s",
                    email,
                    clientIp
            );

            throw new NotAuthorizedException("Admin user is inactive");
        }

        if (!isPasswordValid(request.password, adminUser.passwordHash)) {
            LOG.warnf(
                    "Invalid admin login attempt, email=%s, clientIp=%s",
                    email,
                    clientIp
            );

            throw new NotAuthorizedException("Invalid email or password");
        }

        String accessToken = tokenService.createAccessToken(adminUser);
        String refreshToken = tokenService.createRefreshToken(adminUser);

        LOG.infof(
                "Admin login success, email=%s, clientIp=%s",
                adminUser.email,
                clientIp
        );

        return new LoginResponse(
                accessToken,
                refreshToken,
                "Bearer",
                tokenService.getAccessTokenExpiresIn(),
                adminUser.displayName,
                adminUser.role
        );
    }

    @Transactional
    public LoginResponse refresh(RefreshTokenRequest request) {
        if (request == null || request.refreshToken == null || request.refreshToken.isBlank()) {
            throw new NotAuthorizedException("Refresh token is required");
        }

        AdminUser adminUser = tokenService.validateRefreshToken(request.refreshToken);

        tokenService.rotateRefreshToken(request.refreshToken);

        String newAccessToken = tokenService.createAccessToken(adminUser);
        String newRefreshToken = tokenService.createRefreshToken(adminUser);

        LOG.infof("Admin token refreshed, email=%s", adminUser.email);

        return new LoginResponse(
                newAccessToken,
                newRefreshToken,
                "Bearer",
                tokenService.getAccessTokenExpiresIn(),
                adminUser.displayName,
                adminUser.role
        );
    }

    @Transactional
    public void logout(LogoutRequest request) {
        if (request == null || request.refreshToken == null || request.refreshToken.isBlank()) {
            throw new NotAuthorizedException("Refresh token is required");
        }

        tokenService.revokeRefreshToken(request.refreshToken);

        LOG.info("Admin logout success");
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (!Boolean.TRUE.equals(registerEnabled)) {
            throw new ForbiddenException("Admin register is disabled");
        }

        if (request == null) {
            throw new ForbiddenException("Register request is required");
        }

        if (request.email == null || request.email.isBlank()) {
            throw new ForbiddenException("Email is required");
        }

        if (request.password == null || request.password.isBlank()) {
            throw new ForbiddenException("Password is required");
        }

        if (request.password.length() < 6) {
            throw new ForbiddenException("Password must be at least 6 characters");
        }
    }

    private void validateRegisterSetupKey(RegisterRequest request) {
        if (registerSetupKey == null || registerSetupKey.isBlank()) {
            return;
        }

        if (request.setupKey == null || !registerSetupKey.equals(request.setupKey)) {
            throw new ForbiddenException("Invalid setup key");
        }
    }

    private boolean isClientIpAllowed(String clientIp) {
        return ipAllowlistService.isAllowed(clientIp);
    }

    private boolean isPasswordValid(String rawPassword, String passwordHash) {
        if (rawPassword == null || rawPassword.isBlank()) {
            return false;
        }

        if (passwordHash == null || passwordHash.isBlank()) {
            return false;
        }

        return BCrypt.checkpw(rawPassword, passwordHash);
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new NotAuthorizedException("Invalid email or password");
        }

        if (request.email == null || request.email.isBlank()) {
            throw new NotAuthorizedException("Invalid email or password");
        }

        if (request.password == null || request.password.isBlank()) {
            throw new NotAuthorizedException("Invalid email or password");
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String normalizeOrDefault(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }

        return value.trim();
    }
}