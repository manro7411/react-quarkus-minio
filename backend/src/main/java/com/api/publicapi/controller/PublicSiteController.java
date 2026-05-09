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
    @Path("/{siteKey}/hero")
    public Response getHero(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getHero(siteKey)).build();
    }

    @GET
    @Path("/{siteKey}/countdown")
    public Response getCountdown(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getCountdown(siteKey)).build();
    }

    @GET
    @Path("/{siteKey}/love-letter")
    public Response getLoveLetter(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getLoveLetter(siteKey)).build();
    }

    @GET
    @Path("/{siteKey}/final-surprise")
    public Response getFinalSurprise(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getFinalSurprise(siteKey)).build();
    }

    @GET
    @Path("/{siteKey}/gallery")
    public Response getGallery(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getGallery(siteKey)).build();
    }

    @GET
    @Path("/{siteKey}/memories")
    public Response getMemories(@PathParam("siteKey") String siteKey) {
        return Response.ok(publicSiteService.getMemories(siteKey)).build();
    }
}