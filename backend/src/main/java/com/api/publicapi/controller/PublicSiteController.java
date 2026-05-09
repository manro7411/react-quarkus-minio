package com.api.publicapi.controller;

import com.api.common.constant.ApiPaths;
import com.api.publicapi.service.PublicSiteService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path(ApiPaths.PUBLIC_SITE)
@Produces(MediaType.APPLICATION_JSON)
public class PublicSiteController {

    @Inject
    PublicSiteService publicSiteService;

    @GET
    @Path("/{siteKey}")
    public Response getSite(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getSite(siteKey)).build();
    }

    @GET
    @Path("/{siteKey}/gallery")
    public Response getGallery(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getGallery(siteKey)).build();
    }
}