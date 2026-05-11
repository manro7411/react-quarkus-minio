package com.api.proposal.repository;

import com.api.proposal.entity.ProposalDocument;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ProposalDocumentRepository implements PanacheRepositoryBase<ProposalDocument, UUID> {

    public Optional<ProposalDocument> findByReferenceNo(String referenceNo) {
        return find("referenceNo", referenceNo).firstResultOptional();
    }
}