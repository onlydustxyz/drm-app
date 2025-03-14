-- Create segments table
CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
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