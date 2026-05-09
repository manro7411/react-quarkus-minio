package com.api.admin.controller;

import com.api.admin.service.AdminDashboardService;
import com.api.common.constant.ApiPaths;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(ApiPaths.ADMIN_DASHBOARD)
@Produces(MediaType.APPLICATION_JSON)
public class AdminDashboardController {

    @Inject
    AdminDashboardService adminDashboardService;

    @GET
    @Path("/stats")
    public Response getStats() {
        return Response.ok(adminDashboardService.getStats()).build();
    }
}