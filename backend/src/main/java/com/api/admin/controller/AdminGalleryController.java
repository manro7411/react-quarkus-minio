package com.api.admin.controller;

import com.api.admin.dto.request.GalleryPhotoCreateRequest;
import com.api.admin.service.AdminGalleryService;
import com.api.common.constant.ApiPaths;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.api.admin.dto.request.GalleryPhotoUpdateRequest;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import java.util.UUID;
@Path(ApiPaths.ADMIN_GALLERY)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminGalleryController {

    @Inject
    AdminGalleryService adminGalleryService;

    @GET
    @Path("/photos")
    public Response getPhotos() {
        return Response.ok(adminGalleryService.getPhotos()).build();
    }

    @POST
    @Path("/photos")
    public Response createPhoto(@Valid GalleryPhotoCreateRequest request) {
        return Response.status(Response.Status.CREATED)
                .entity(adminGalleryService.createPhoto(request))
                .build();
    }
    @PUT
    @Path("/photos/{id}")
    public Response updatePhoto(
            @PathParam("id") UUID id,
            GalleryPhotoUpdateRequest request
    ) {
        return Response.ok(adminGalleryService.updatePhoto(id, request)).build();
    }

    @DELETE
    @Path("/photos/{id}")
    public Response deletePhoto(@PathParam("id") UUID id) {
        adminGalleryService.deletePhoto(id);
        return Response.noContent().build();
    }
}