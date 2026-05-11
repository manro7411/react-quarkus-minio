package com.api.proposal.dto;

public class GenerateProposalResponse {

    public String referenceNo;
    public String fileName;
    public String bucketName;
    public String objectKey;
    public String downloadUrl;
    public long sizeBytes;

    public GenerateProposalResponse() {
    }

    public GenerateProposalResponse(
            String referenceNo,
            String fileName,
            String bucketName,
            String objectKey,
            String downloadUrl,
            long sizeBytes
    ) {
        this.referenceNo = referenceNo;
        this.fileName = fileName;
        this.bucketName = bucketName;
        this.objectKey = objectKey;
        this.downloadUrl = downloadUrl;
        this.sizeBytes = sizeBytes;
    }
}