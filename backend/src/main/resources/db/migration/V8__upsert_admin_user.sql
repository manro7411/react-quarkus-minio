CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO admin_users (
    email,
    password_hash,
    display_name,
    role,
    active,
    created_at,
    updated_at
)
VALUES (
    'admin@n9ne.cc',
    '$2a$10$mQ6oJqF4bR7D7nyr8KYg8Ov9d5Uw0hIFLUSvpWbJUdrW/qH3/.g7q',
    'Admin',
    'SUPER_ADMIN',
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (email)
DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    active = TRUE,
    updated_at = NOW();