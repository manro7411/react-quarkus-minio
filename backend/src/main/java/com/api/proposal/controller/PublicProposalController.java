package com.api.proposal.controller;

import com.api.proposal.client.ProposalHealthClient;
import com.api.proposal.dto.GenerateProposalRequest;
import com.api.proposal.dto.PublicGenerateProposalResponse;
import com.api.proposal.service.ProposalService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/public/proposals")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PublicProposalController {

    @Inject
    ProposalService proposalService;

    @Inject
    ProposalHealthClient proposalHealthClient;

    @GET
    @Path("/test-connection")
    @Produces(MediaType.TEXT_PLAIN)
    public Response testConnection() {
        return Response.ok(proposalHealthClient.testConnection())
                .type(MediaType.TEXT_PLAIN)
                .build();
    }

    @POST
    @Path("/generate")
    public Response generateProposal(
            @Valid GenerateProposalRequest request,
            @Context HttpHeaders headers
    ) {
        String clientIpAddress = resolveClientIp(headers);

        PublicGenerateProposalResponse response =
                proposalService.generate(request, clientIpAddress);

        return Response.ok(response).build();
    }

    @GET
    @Path("/files/{referenceNo}")
    @Produces("application/pdf")
    public Response downloadProposal(@PathParam("referenceNo") String referenceNo) {
        Response generatorResponse = proposalService.download(referenceNo);

        if (generatorResponse.getStatus() >= 400) {
            return Response.status(generatorResponse.getStatus())
                    .entity(generatorResponse.readEntity(String.class))
                    .type(MediaType.TEXT_PLAIN)
                    .build();
        }

        java.io.InputStream stream =
                generatorResponse.readEntity(java.io.InputStream.class);

        String contentDisposition =
                generatorResponse.getHeaderString("Content-Disposition");

        if (contentDisposition == null || contentDisposition.isBlank()) {
            contentDisposition = "inline; filename=\"Containerfile.proposal-generator-" + referenceNo + ".pdf\"";
        }

        return Response.ok(stream)
                .type("application/pdf")
                .header("Content-Disposition", contentDisposition)
                .build();
    }

    private String resolveClientIp(HttpHeaders headers) {
        String forwardedFor = headers.getHeaderString("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        String realIp = headers.getHeaderString("X-Real-IP");

        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }

        return "unknown";
    }
}