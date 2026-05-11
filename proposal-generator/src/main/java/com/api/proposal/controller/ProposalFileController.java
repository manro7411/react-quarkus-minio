package com.api.proposal.controller;

import com.api.proposal.entity.ProposalDocument;
import com.api.proposal.repository.ProposalDocumentRepository;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.io.InputStream;

@Path("/internal/proposals/files")
public class ProposalFileController {

    @Inject
    ProposalDocumentRepository proposalDocumentRepository;

    @Inject
    MinioClient minioClient;

    @GET
    @Path("/{referenceNo}")
    @Produces("application/pdf")
    public Response downloadByReferenceNo(@PathParam("referenceNo") String referenceNo) {
        ProposalDocument document = proposalDocumentRepository.findByReferenceNo(referenceNo)
                .orElseThrow(() -> new NotFoundException("Proposal document not found: " + referenceNo));

        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(document.bucketName)
                            .object(document.objectKey)
                            .build()
            );

            return Response.ok(stream)
                    .type(document.contentType)
                    .header(
                            "Content-Disposition",
                            "inline; filename=\"" + document.fileName + "\""
                    )
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to download Containerfile.proposal-generator PDF", e);
        }
    }
}