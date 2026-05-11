ALTER TABLE proposal_documents
ADD COLUMN IF NOT EXISTS client_ip_address VARCHAR(80);

ALTER TABLE proposal_documents
ADD COLUMN IF NOT EXISTS source_service VARCHAR(120);