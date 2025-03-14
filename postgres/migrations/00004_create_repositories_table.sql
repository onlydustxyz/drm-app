-- Create repositories table and insert mock data

-- Repositories table
CREATE TABLE IF NOT EXISTS repositories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    open_issues INTEGER DEFAULT 0,
    language VARCHAR(100),
    owner VARCHAR(255) NOT NULL,
    is_fork BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    last_commit_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_repositories_owner ON repositories(owner);
CREATE INDEX idx_repositories_language ON repositories(language);
CREATE INDEX idx_repositories_created_at ON repositories(created_at);

-- Add updated_at trigger
CREATE TRIGGER update_repositories_updated_at
BEFORE UPDATE ON repositories
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();