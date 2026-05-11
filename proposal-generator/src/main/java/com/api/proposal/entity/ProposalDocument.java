package com.api.proposal.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "proposal_documents")
public class ProposalDocument extends PanacheEntityBase {

    @Id
    @Column(name = "id")
    public UUID id;

    @Column(name = "reference_no", nullable = false, unique = true)
    public String referenceNo;

    @Column(name = "site_key")
    public String siteKey;

    @Column(name = "asked_by")
    public String askedBy;

    @Column(name = "accepted_by")
    public String acceptedBy;

    @Column(name = "accepted_date")
    public String acceptedDate;

    @Column(name = "file_name", nullable = false)
    public String fileName;

    @Column(name = "bucket_name", nullable = false)
    public String bucketName;

    @Column(name = "object_key", nullable = false)
    public String objectKey;

    @Column(name = "content_type", nullable = false)
    public String contentType;

    @Column(name = "size_bytes", nullable = false)
    public long sizeBytes;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "client_ip_address")
    public String clientIpAddress;

    @Column(name = "source_service")
    public String sourceService;
}