package com.api.admin.controller;

import com.api.admin.dto.request.LoginRequest;
import com.api.admin.dto.request.LogoutRequest;
import com.api.admin.dto.request.RefreshTokenRequest;
import com.api.admin.dto.request.RegisterRequest;
import com.api.admin.service.AdminAuthService;
import com.api.common.constant.ApiPaths;
import com.api.common.util.ClientIpUtil;
import io.vertx.core.http.HttpServerRequest;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(ApiPaths.ADMIN_AUTH)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminAuthController {

    @Inject
    AdminAuthService adminAuthService;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest request) {
        return Response.status(Response.Status.CREATED)
                .entity(adminAuthService.register(request))
                .build();
    }

    @POST
    @Path("/login")
    public Response login(
            @Valid LoginRequest request,
            @Context HttpHeaders headers,
            @Context HttpServerRequest httpRequest
    ) {
        String remoteAddress = httpRequest.remoteAddress() != null
                ? httpRequest.remoteAddress().host()
                : null;

        String clientIp = ClientIpUtil.extractClientIp(headers, remoteAddress);

        return Response.ok(adminAuthService.login(request, clientIp)).build();
    }

    @POST
    @Path("/refresh")
    public Response refresh(@Valid RefreshTokenRequest request) {
        return Response.ok(adminAuthService.refresh(request)).build();
    }

    @POST
    @Path("/logout")
    public Response logout(@Valid LogoutRequest request) {
        adminAuthService.logout(request);
        return Response.noContent().build();
    }
}