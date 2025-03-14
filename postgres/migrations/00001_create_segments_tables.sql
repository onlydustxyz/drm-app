-- Create users table

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);

-- Add updated_at trigger
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 

-- Create segments table
CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on segments.name
CREATE INDEX idx_segments_name ON segments(name);

-- Create segments_contributors join table
CREATE TABLE segments_contributors (
    id SERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
    contributor_github_login VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for the join table
CREATE INDEX idx_segments_contributors_segment_id ON segments_contributors(segment_id);
CREATE INDEX idx_segments_contributors_github_login ON segments_contributors(contributor_github_login);
-- Create a unique constraint to prevent duplicate entries
CREATE UNIQUE INDEX idx_segments_contributors_unique ON segments_contributors(segment_id, contributor_github_login);

-- Create segment_repositories join table
CREATE TABLE segment_repositories (
    id SERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
    repository_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for the join table
CREATE INDEX idx_segment_repositories_segment_id ON segment_repositories(segment_id);
CREATE INDEX idx_segment_repositories_repository_url ON segment_repositories(repository_url);
-- Create a unique constraint to prevent duplicate entries
CREATE UNIQUE INDEX idx_segment_repositories_unique ON segment_repositories(segment_id, repository_url); 