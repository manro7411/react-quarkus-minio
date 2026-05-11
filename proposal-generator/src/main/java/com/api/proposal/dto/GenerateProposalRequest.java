package com.api.proposal.dto;

public class GenerateProposalRequest {

    public String siteKey;
    public String title;
    public String subtitle;
    public String message;
    public String askedBy;
    public String acceptedBy;
    public String acceptedDate;

    // Metadata from backend
    public String clientIpAddress;
    public String sourceService;
}