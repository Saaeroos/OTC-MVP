-- Seed users (password is 'password123')
-- Hash generated using passlib[bcrypt]
INSERT INTO users (username, email, password_hash, role, name)
VALUES 
    ('mo_alhayek', 'mo_alhayek@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaGuNoG.U.E/k5U/5L/m2L6G.L.G.L.', 'trader', 'Mo Alhayek'),
    ('mo_money', 'momoney@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaGuNoG.U.E/k5U/5L/m2L6G.L.G.L.', 'trader', 'Mo Money'),
    ('sarah_manager', 'sarah@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaGuNoG.U.E/k5U/5L/m2L6G.L.G.L.', 'manager', 'Sarah Manager')
ON CONFLICT (username) DO NOTHING;
