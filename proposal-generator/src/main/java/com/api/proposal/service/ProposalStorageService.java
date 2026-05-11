package com.api.proposal.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.ByteArrayInputStream;

@ApplicationScoped
public class ProposalStorageService {

    private static final String CONTENT_TYPE_PDF = "application/pdf";

    @Inject
    MinioClient minioClient;

    @ConfigProperty(name = "minio.bucket")
    String bucketName;

    @ConfigProperty(name = "minio.proposal-prefix")
    String proposalPrefix;

    @ConfigProperty(name = "minio.public-base-url")
    String publicBaseUrl;

    public StoredProposal uploadPdf(String referenceNo, String fileName, byte[] pdfBytes) {
        try {
            ensureBucketExists();

            String objectKey = buildObjectKey(referenceNo, fileName);

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .stream(new ByteArrayInputStream(pdfBytes), pdfBytes.length, -1)
                            .contentType(CONTENT_TYPE_PDF)
                            .build()
            );

            return new StoredProposal(
                    bucketName,
                    objectKey,
                    buildDownloadUrl(referenceNo),
                    CONTENT_TYPE_PDF,
                    pdfBytes.length
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload Containerfile.proposal-generator PDF to MinIO", e);
        }
    }

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build()
        );

        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
        }
    }

    private String buildObjectKey(String referenceNo, String fileName) {
        String prefix = proposalPrefix == null || proposalPrefix.isBlank()
                ? "proposals"
                : proposalPrefix.replaceAll("^/+|/+$", "");

        return prefix + "/" + referenceNo + "/" + fileName;
    }

    private String buildDownloadUrl(String referenceNo) {
        String baseUrl = publicBaseUrl.replaceAll("/+$", "");
        return baseUrl + "/" + referenceNo;
    }

    public static class StoredProposal {
        public final String bucketName;
        public final String objectKey;
        public final String downloadUrl;
        public final String contentType;
        public final long sizeBytes;

        public StoredProposal(
                String bucketName,
                String objectKey,
                String downloadUrl,
                String contentType,
                long sizeBytes
        ) {
            this.bucketName = bucketName;
            this.objectKey = objectKey;
            this.downloadUrl = downloadUrl;
            this.contentType = contentType;
            this.sizeBytes = sizeBytes;
        }
    }
}