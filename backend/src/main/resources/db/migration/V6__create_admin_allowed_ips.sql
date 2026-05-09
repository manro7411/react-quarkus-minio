CREATE TABLE IF NOT EXISTS admin_allowed_ips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_allowed_ips_ip_address
ON admin_allowed_ips(ip_address);

CREATE INDEX IF NOT EXISTS idx_admin_allowed_ips_active
ON admin_allowed_ips(active);

INSERT INTO admin_allowed_ips (
    ip_address,
    description,
    active
)
VALUES
(
    '127.0.0.1',
    'Localhost IPv4',
    TRUE
),
(
    '0:0:0:0:0:0:0:1',
    'Localhost IPv6',
    TRUE
),
(
    '::1',
    'Localhost IPv6 short',
    TRUE
),
(
    '107.172.13.174',
    'Allowed admin login IP',
    TRUE
)
ON CONFLICT (ip_address) DO UPDATE SET
    active = TRUE,
    updated_at = NOW();