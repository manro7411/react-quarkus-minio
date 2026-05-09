CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_refresh_tokens_admin_user_id
ON admin_refresh_tokens(admin_user_id);

CREATE INDEX IF NOT EXISTS idx_admin_refresh_tokens_token_hash
ON admin_refresh_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_admin_refresh_tokens_revoked
ON admin_refresh_tokens(revoked);