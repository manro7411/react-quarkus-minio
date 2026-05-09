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
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeG4hHF2yW9vQR9VQyQHhQ7yZ7lZt1g0i',
    'Admin',
    'SUPER_ADMIN',
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;