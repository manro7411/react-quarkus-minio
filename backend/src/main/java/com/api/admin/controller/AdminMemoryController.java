package com.api.admin.controller;

import com.api.admin.dto.request.MemoryCreateRequest;
import com.api.admin.dto.request.MemoryUpdateRequest;
import com.api.admin.service.AdminMemoryService;
import com.api.common.constant.ApiPaths;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.UUID;

@PermitAll
@Path(ApiPaths.ADMIN_MEMORIES)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminMemoryController {

    @Inject
    AdminMemoryService adminMemoryService;

    @GET
    public Response getMemories() {
        return Response.ok(adminMemoryService.getMemories()).build();
    }

    @GET
    @Path("/{id}")
    public Response getMemory(@PathParam("id") UUID id) {
        return Response.ok(adminMemoryService.getMemory(id)).build();
    }

    @POST
    public Response createMemory(@Valid MemoryCreateRequest request) {
        return Response.status(Response.Status.CREATED)
                .entity(adminMemoryService.createMemory(request))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateMemory(
            @PathParam("id") UUID id,
            @Valid MemoryUpdateRequest request
    ) {
        return Response.ok(adminMemoryService.updateMemory(id, request)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteMemory(@PathParam("id") UUID id) {
        adminMemoryService.deleteMemory(id);
        return Response.noContent().build();
    }
}