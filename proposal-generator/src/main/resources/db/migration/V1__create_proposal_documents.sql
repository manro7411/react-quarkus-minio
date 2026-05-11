CREATE TABLE IF NOT EXISTS proposal_documents (
    id UUID PRIMARY KEY,
    reference_no VARCHAR(80) NOT NULL UNIQUE,
    site_key VARCHAR(120),
    asked_by VARCHAR(255),
    accepted_by VARCHAR(255),
    accepted_date VARCHAR(20),
    file_name VARCHAR(255) NOT NULL,
    bucket_name VARCHAR(120) NOT NULL,
    object_key VARCHAR(500) NOT NULL,
    content_type VARCHAR(80) NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_proposal_documents_reference_no
ON proposal_documents(reference_no);

CREATE INDEX IF NOT EXISTS idx_proposal_documents_site_key
ON proposal_documents(site_key);