package com.api.admin.controller;

import com.api.admin.dto.request.HeroUpdateRequest;
import com.api.admin.service.AdminContentService;
import com.api.common.constant.ApiPaths;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(ApiPaths.ADMIN_HERO)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminHeroController {

    @Inject
    AdminContentService adminContentService;

    @GET
    public Response getHero() {
        return Response.ok(adminContentService.getHero()).build();
    }

    @PUT
    public Response updateHero(HeroUpdateRequest request) {
        return Response.ok(adminContentService.updateHero(request)).build();
    }
}