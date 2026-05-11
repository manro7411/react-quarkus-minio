package com.api.proposal.service;

import com.api.proposal.client.ProposalGeneratorClient;
import com.api.proposal.dto.GenerateProposalRequest;
import com.api.proposal.dto.GenerateProposalResponse;
import com.api.proposal.dto.PublicGenerateProposalResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class ProposalService {

    @Inject
    ProposalGeneratorClient proposalGeneratorClient;

    @ConfigProperty(name = "proposal.public-base-url")
    String proposalPublicBaseUrl;

    private static final String proposalSourceService = "GENERATED_PROPOSAL_SERVICE";

    public PublicGenerateProposalResponse generate(
            GenerateProposalRequest request,
            String clientIpAddress
    ) {
        request.clientIpAddress = clientIpAddress;
        request.sourceService = proposalSourceService;

        GenerateProposalResponse internalResponse =
                proposalGeneratorClient.generateProposal(request);

        String publicDownloadUrl = buildPublicDownloadUrl(internalResponse.referenceNo);

        return new PublicGenerateProposalResponse(
                internalResponse.referenceNo,
                internalResponse.fileName,
                publicDownloadUrl,
                internalResponse.sizeBytes
        );
    }

    public Response download(String referenceNo) {
        return proposalGeneratorClient.downloadProposal(referenceNo);
    }

    private String buildPublicDownloadUrl(String referenceNo) {
        String baseUrl = proposalPublicBaseUrl.replaceAll("/+$", "");
        return baseUrl + "/" + referenceNo;
    }
}