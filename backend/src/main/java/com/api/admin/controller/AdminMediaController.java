package com.api.admin.controller;

import com.api.admin.service.AdminMediaService;
import com.api.common.constant.ApiPaths;
import com.api.media.service.MinioStorageService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.util.UUID;

@Path(ApiPaths.ADMIN_MEDIA)
@Produces(MediaType.APPLICATION_JSON)
public class AdminMediaController {

    @Inject
    MinioStorageService minioStorageService;

    @Inject
    AdminMediaService adminMediaService;

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response upload(
            @RestForm("file") FileUpload file,
            @RestForm("folder") String folder
    ) {
        return Response.ok(minioStorageService.upload(file, folder)).build();
    }

    @GET
    public Response getMediaObjects() {
        return Response.ok(adminMediaService.getMediaObjects()).build();
    }

    @GET
    @Path("/{id}")
    public Response getMediaObject(@PathParam("id") UUID id) {
        return Response.ok(adminMediaService.getMediaObject(id)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteMediaObject(@PathParam("id") UUID id) {
        adminMediaService.deleteMediaObject(id);
        return Response.noContent().build();
    }
}