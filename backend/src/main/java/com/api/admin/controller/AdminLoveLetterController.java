package com.api.admin.controller;

import com.api.admin.dto.request.LoveLetterUpdateRequest;
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

@Path(ApiPaths.ADMIN_LOVE_LETTER)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminLoveLetterController {

    @Inject
    AdminContentService adminContentService;

    @GET
    public Response getLoveLetter() {
        return Response.ok(adminContentService.getLoveLetter()).build();
    }

    @PUT
    public Response updateLoveLetter(LoveLetterUpdateRequest request) {
        return Response.ok(adminContentService.updateLoveLetter(request)).build();
    }
}