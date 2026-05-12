package com.api.proposal.client;

import com.api.proposal.dto.GenerateProposalRequest;
import com.api.proposal.dto.GenerateProposalResponse;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/")
@RegisterRestClient(configKey = "proposal-generator")
public interface ProposalGeneratorRestClient {

    @GET
    @Path("/Testconnection")
    @Produces(MediaType.TEXT_PLAIN)
    String testConnection();

    @POST
    @Path("/internal/proposals/generate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    GenerateProposalResponse generateProposal(GenerateProposalRequest request);

    @GET
    @Path("/internal/proposals/files/{referenceNo}")
    @Produces("application/pdf")
    Response downloadProposal(@PathParam("referenceNo") String referenceNo);
}