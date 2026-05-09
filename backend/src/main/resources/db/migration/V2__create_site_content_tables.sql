CREATE TABLE IF NOT EXISTS hero_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_profile_id UUID NOT NULL REFERENCES site_profiles(id) ON DELETE CASCADE,
    media_object_id UUID REFERENCES media_objects(id) ON DELETE SET NULL,
    headline VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    cta_text VARCHAR(100),
    cta_url VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS countdowns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_profile_id UUID NOT NULL REFERENCES site_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_datetime TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS love_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_profile_id UUID NOT NULL REFERENCES site_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    signature VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS final_surprises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_profile_id UUID NOT NULL REFERENCES site_profiles(id) ON DELETE CASCADE,
    media_object_id UUID REFERENCES media_objects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    button_text VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_sections_site_profile_id
ON hero_sections(site_profile_id);

CREATE INDEX IF NOT EXISTS idx_countdowns_site_profile_id
ON countdowns(site_profile_id);

CREATE INDEX IF NOT EXISTS idx_love_letters_site_profile_id
ON love_letters(site_profile_id);

CREATE INDEX IF NOT EXISTS idx_final_surprises_site_profile_id
ON final_surprises(site_profile_id);

INSERT INTO hero_sections (
    site_profile_id,
    headline,
    subtitle,
    cta_text,
    cta_url,
    active
)
SELECT
    id,
    'I have something special for you',
    'A little surprise made just for you',
    'Open Your Surprise',
    '#surprise',
    TRUE
FROM site_profiles
WHERE site_key = 'panpan'
AND NOT EXISTS (
    SELECT 1
    FROM hero_sections h
    WHERE h.site_profile_id = site_profiles.id
);

INSERT INTO countdowns (
    site_profile_id,
    title,
    target_datetime,
    active
)
SELECT
    id,
    'Something special is coming',
    NOW() + INTERVAL '23 days',
    TRUE
FROM site_profiles
WHERE site_key = 'panpan'
AND NOT EXISTS (
    SELECT 1
    FROM countdowns c
    WHERE c.site_profile_id = site_profiles.id
);

INSERT INTO love_letters (
    site_profile_id,
    title,
    body,
    signature,
    active
)
SELECT
    id,
    'A Letter For You',
    'From the moment we met, my world became brighter. You are my today and all of my tomorrows.',
    'Forever yours',
    TRUE
FROM site_profiles
WHERE site_key = 'panpan'
AND NOT EXISTS (
    SELECT 1
    FROM love_letters l
    WHERE l.site_profile_id = site_profiles.id
);

INSERT INTO final_surprises (
    site_profile_id,
    title,
    message,
    button_text,
    active
)
SELECT
    id,
    'Are you ready for your final surprise?',
    'The best is yet to come...',
    'Reveal Final Surprise',
    TRUE
FROM site_profiles
WHERE site_key = 'panpan'
AND NOT EXISTS (
    SELECT 1
    FROM final_surprises f
    WHERE f.site_profile_id = site_profiles.id
);