package com.api.proposal.controller;

import com.api.proposal.dto.GenerateProposalRequest;
import com.api.proposal.service.ProposalDocumentService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/internal/proposals")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProposalGenerateController {

    @Inject
    ProposalDocumentService proposalDocumentService;

    @POST
    @Path("/generate")
    public Response generate(@Valid GenerateProposalRequest request) {
        return Response.ok(
                proposalDocumentService.generateSaveAndRecord(request)
        ).build();
    }
}