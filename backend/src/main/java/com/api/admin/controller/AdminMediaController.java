package com.api.admin.controller;

import com.api.common.constant.ApiPaths;
import com.api.media.service.MinioStorageService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

@Path(ApiPaths.ADMIN_MEDIA)
@Produces(MediaType.APPLICATION_JSON)
public class AdminMediaController {

    @Inject
    MinioStorageService minioStorageService;

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response upload(
            @RestForm("file") FileUpload file,
            @RestForm("folder") String folder
    ) {
        return Response.ok(minioStorageService.upload(file, folder)).build();
    }
}