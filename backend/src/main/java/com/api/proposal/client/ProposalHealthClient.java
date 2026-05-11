package com.api.proposal.client;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class ProposalHealthClient {

    @Inject
    @RestClient
    ProposalGeneratorRestClient proposalGeneratorRestClient;

    public String testConnection() {
        return proposalGeneratorRestClient.testConnection();
    }
}