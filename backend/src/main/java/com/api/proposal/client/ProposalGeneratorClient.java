package com.api.proposal.client;

import com.api.proposal.dto.GenerateProposalRequest;
import com.api.proposal.dto.GenerateProposalResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class ProposalGeneratorClient {

    @Inject
    @RestClient
    ProposalGeneratorRestClient proposalGeneratorRestClient;

    public GenerateProposalResponse generateProposal(GenerateProposalRequest request) {
        return proposalGeneratorRestClient.generateProposal(request);
    }

    public Response downloadProposal(String referenceNo) {
        return proposalGeneratorRestClient.downloadProposal(referenceNo);
    }
}