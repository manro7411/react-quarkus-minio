CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_profile_id UUID NOT NULL REFERENCES site_profiles(id) ON DELETE CASCADE,
    media_object_id UUID REFERENCES media_objects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    memory_date DATE,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memories_site_profile_id
ON memories(site_profile_id);

CREATE INDEX IF NOT EXISTS idx_memories_visible
ON memories(visible);

CREATE INDEX IF NOT EXISTS idx_memories_sort_order
ON memories(sort_order);