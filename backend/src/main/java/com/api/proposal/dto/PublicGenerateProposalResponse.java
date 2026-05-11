package com.api.proposal.dto;

public class PublicGenerateProposalResponse {

    public String referenceNo;
    public String fileName;
    public String downloadUrl;
    public long sizeBytes;

    public PublicGenerateProposalResponse() {
    }

    public PublicGenerateProposalResponse(
            String referenceNo,
            String fileName,
            String downloadUrl,
            long sizeBytes
    ) {
        this.referenceNo = referenceNo;
        this.fileName = fileName;
        this.downloadUrl = downloadUrl;
        this.sizeBytes = sizeBytes;
    }
}