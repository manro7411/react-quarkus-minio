package com.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/Testconnection")
public class Testconnection {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Is it working!";
    }
}
