package com.api.admin.controller;

import com.api.admin.dto.request.FinalSurpriseUpdateRequest;
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

@Path(ApiPaths.ADMIN_FINAL_SURPRISE)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminFinalSurpriseController {

    @Inject
    AdminContentService adminContentService;

    @GET
    public Response getFinalSurprise() {
        return Response.ok(adminContentService.getFinalSurprise()).build();
    }

    @PUT
    public Response updateFinalSurprise(FinalSurpriseUpdateRequest request) {
        return Response.ok(adminContentService.updateFinalSurprise(request)).build();
    }
}