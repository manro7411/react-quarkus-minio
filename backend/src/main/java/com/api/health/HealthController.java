package com.api.health;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/health")
public class HealthController {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String health() {
        return "OK";
    }
}