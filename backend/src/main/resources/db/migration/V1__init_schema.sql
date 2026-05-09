CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_name VARCHAR(100) NOT NULL,
    object_key VARCHAR(500) NOT NULL UNIQUE,
    original_filename VARCHAR(255),
    content_type VARCHAR(100),
    size_bytes BIGINT,
    checksum VARCHAR(255),
    visibility VARCHAR(50) NOT NULL DEFAULT 'PRIVATE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_profile_id UUID NOT NULL REFERENCES site_profiles(id) ON DELETE CASCADE,
    media_object_id UUID NOT NULL REFERENCES media_objects(id) ON DELETE CASCADE,
    caption VARCHAR(255),
    photo_date DATE,
    favorite BOOLEAN NOT NULL DEFAULT FALSE,
    hidden BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO site_profiles (
    site_key,
    title,
    subtitle,
    status
)
VALUES (
    'panpan',
    'For My Love',
    'A romantic surprise website',
    'ACTIVE'
)
ON CONFLICT (site_key) DO NOTHING;