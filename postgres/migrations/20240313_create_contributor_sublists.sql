-- Create contributor sublists tables migration

-- Contributor Sublists table
CREATE TABLE IF NOT EXISTS contributor_sublists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Contributor Sublists Contributors join table
CREATE TABLE IF NOT EXISTS contributor_sublists_contributors (
    sublist_id INTEGER NOT NULL REFERENCES contributor_sublists(id) ON DELETE CASCADE,
    contributor_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (sublist_id, contributor_id)
);

-- Contributor Retention table
CREATE TABLE IF NOT EXISTS contributor_retention (
    id SERIAL PRIMARY KEY,
    month VARCHAR(10) NOT NULL,
    active_count INTEGER NOT NULL,
    total_count INTEGER NOT NULL, 
    retention_rate INTEGER NOT NULL,
    contributor_ids JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX idx_contributor_sublists_name ON contributor_sublists(name);
CREATE INDEX idx_contributor_sublists_created_at ON contributor_sublists(created_at);
CREATE INDEX idx_contributor_sublists_contributors_contributor_id ON contributor_sublists_contributors(contributor_id);
CREATE INDEX idx_contributor_retention_month ON contributor_retention(month);

-- Insert sample data into contributor_sublists and join table
-- First insert into contributor_sublists without the JSONB data
INSERT INTO contributor_sublists (name, description, created_at, updated_at) 
VALUES 
    ('Core Contributors', 'Key contributors to the project', now(), now()),
    ('New Contributors', 'Recently joined contributors', now(), now()),
    ('Documentation Team', 'Contributors focused on documentation', now(), now()),
    ('Feature Developers', 'Contributors working on new features', now(), now());

-- Now insert the relationships into the join table
-- Core Contributors
INSERT INTO contributor_sublists_contributors (sublist_id, contributor_id)
VALUES 
    (1, 1),
    (1, 3),
    (1, 5);

-- New Contributors
INSERT INTO contributor_sublists_contributors (sublist_id, contributor_id)
VALUES 
    (2, 2),
    (2, 4);

-- Documentation Team
INSERT INTO contributor_sublists_contributors (sublist_id, contributor_id)
VALUES 
    (3, 6),
    (3, 7),
    (3, 9);

-- Feature Developers
INSERT INTO contributor_sublists_contributors (sublist_id, contributor_id)
VALUES 
    (4, 1),
    (4, 4),
    (4, 8),
    (4, 10);

-- Insert sample data into contributor_retention
INSERT INTO contributor_retention (month, active_count, total_count, retention_rate, contributor_ids) 
VALUES 
    ('Jan', 5, 7, 71, '["1", "2", "3", "5", "7"]'),
    ('Feb', 6, 8, 75, '["1", "2", "3", "4", "5", "8"]'),
    ('Mar', 8, 10, 80, '["1", "2", "3", "4", "5", "6", "7", "9"]'),
    ('Apr', 7, 10, 70, '["1", "3", "4", "5", "6", "7", "10"]'),
    ('May', 9, 12, 75, '["1", "2", "3", "4", "5", "6", "7", "8", "11"]'),
    ('Jun', 10, 12, 83, '["1", "2", "3", "4", "5", "6", "7", "8", "9", "11"]'),
    ('Jul', 8, 11, 73, '["1", "3", "4", "5", "7", "8", "9", "11"]'),
    ('Aug', 9, 12, 75, '["1", "2", "3", "5", "6", "7", "9", "10", "11"]'),
    ('Sep', 10, 13, 77, '["1", "2", "3", "4", "5", "6", "7", "8", "10", "11"]'),
    ('Oct', 11, 14, 79, '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12"]'),
    ('Nov', 12, 15, 80, '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]'),
    ('Dec', 11, 15, 73, '["1", "2", "3", "5", "6", "7", "8", "9", "10", "12", "13"]'); 