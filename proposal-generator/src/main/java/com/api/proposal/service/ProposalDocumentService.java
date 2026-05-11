package com.api.proposal.service;

import com.api.proposal.dto.GenerateProposalRequest;
import com.api.proposal.dto.GenerateProposalResponse;
import com.api.proposal.entity.ProposalDocument;
import com.api.proposal.repository.ProposalDocumentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class ProposalDocumentService {

    @Inject
    ProposalJasperService proposalJasperService;

    @Inject
    ProposalStorageService proposalStorageService;

    @Inject
    ProposalDocumentRepository proposalDocumentRepository;

    @Transactional
    public GenerateProposalResponse generateSaveAndRecord(GenerateProposalRequest request) {
        byte[] pdfBytes = proposalJasperService.generatePdf(request);

        String referenceNo = buildReferenceNo(request);
        String fileName = buildFileName(referenceNo);

        ProposalStorageService.StoredProposal stored =
                proposalStorageService.uploadPdf(referenceNo, fileName, pdfBytes);

        ProposalDocument document = new ProposalDocument();
        document.id = UUID.randomUUID();
        document.referenceNo = referenceNo;
        document.siteKey = request.siteKey;
        document.askedBy = request.askedBy;
        document.acceptedBy = request.acceptedBy;
        document.acceptedDate = request.acceptedDate;
        document.clientIpAddress = valueOrDefault(request.clientIpAddress, "unknown");
        document.sourceService = valueOrDefault(request.sourceService, "unknown");
        document.fileName = fileName;
        document.bucketName = stored.bucketName;
        document.objectKey = stored.objectKey;
        document.contentType = stored.contentType;
        document.sizeBytes = stored.sizeBytes;
        document.createdAt = LocalDateTime.now();

        proposalDocumentRepository.persist(document);

        return new GenerateProposalResponse(
                document.referenceNo,
                document.fileName,
                document.bucketName,
                document.objectKey,
                stored.downloadUrl,
                document.sizeBytes
        );
    }

    private String buildReferenceNo(GenerateProposalRequest request) {
        String siteKey = sanitize(request.siteKey).toUpperCase();

        String date = request.acceptedDate == null || request.acceptedDate.isBlank()
                ? "00000000"
                : request.acceptedDate;

        String suffix = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();

        return "PROP-" + siteKey + "-" + date + "-" + suffix;
    }

    private String buildFileName(String referenceNo) {
        return sanitize(referenceNo).toLowerCase() + ".pdf";
    }

    private String sanitize(String value) {
        if (value == null || value.isBlank()) {
            return "unknown";
        }

        return value
                .trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9ก-๙]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private String valueOrDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value.trim();
    }
}