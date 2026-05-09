package com.api.common.security;

import com.api.common.constant.ApiPaths;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.jwt.JsonWebToken;

import jakarta.inject.Inject;

@Provider
@ApplicationScoped
@Priority(Priorities.AUTHENTICATION)
public class AdminAuthFilter implements ContainerRequestFilter {

    @Inject
    JsonWebToken jwt;

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String path = "/" + requestContext.getUriInfo().getPath();

        if (!path.startsWith(ApiPaths.ADMIN)) {
            return;
        }

        if (path.equals(ApiPaths.ADMIN_AUTH + "/login")
                || path.equals(ApiPaths.ADMIN_AUTH + "/refresh")) {
            return;
        }

        String authorization = requestContext.getHeaderString("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new NotAuthorizedException("Missing Authorization Bearer token");
        }

        if (jwt == null || jwt.getSubject() == null) {
            throw new NotAuthorizedException("Invalid or expired access token");
        }
    }
}