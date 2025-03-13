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

-- Insert mock data for repositories
INSERT INTO repositories 
(name, url, description, stars, forks, open_issues, language, owner, is_fork, created_at, last_commit_at)
VALUES
('drm-app', 'https://github.com/onlydust/drm-app', 'Developer Relations Manager application for OnlyDust', 2350, 345, 28, 'TypeScript', 'onlydust', FALSE, '2023-06-15 08:30:00+00', '2024-03-12 13:45:00+00'),
('rust-api', 'https://github.com/onlydust/rust-api', 'High-performance API written in Rust', 1850, 278, 42, 'Rust', 'onlydust', FALSE, '2023-02-10 12:15:00+00', '2024-03-10 09:22:00+00'),
('blockchain-core', 'https://github.com/onlydust/blockchain-core', 'Core blockchain implementation', 3270, 586, 95, 'Rust', 'onlydust', FALSE, '2022-11-05 15:40:00+00', '2024-03-11 18:30:00+00'),
('smart-contracts', 'https://github.com/onlydust/smart-contracts', 'Collection of smart contracts for various chains', 1420, 320, 35, 'Solidity', 'onlydust', FALSE, '2023-01-22 10:00:00+00', '2024-03-09 22:15:00+00'),
('react-components', 'https://github.com/onlydust/react-components', 'Reusable React components library', 890, 145, 18, 'TypeScript', 'onlydust', FALSE, '2023-05-08 14:20:00+00', '2024-03-08 11:50:00+00'),
('docs', 'https://github.com/onlydust/docs', 'Documentation for OnlyDust projects', 320, 87, 15, 'Markdown', 'onlydust', FALSE, '2023-04-17 09:10:00+00', '2024-03-07 16:40:00+00'),
('python-sdk', 'https://github.com/onlydust/python-sdk', 'Python SDK for interacting with OnlyDust services', 720, 132, 25, 'Python', 'onlydust', FALSE, '2023-03-14 11:30:00+00', '2024-03-05 14:25:00+00'),
('go-client', 'https://github.com/onlydust/go-client', 'Go client for OnlyDust APIs', 650, 98, 12, 'Go', 'onlydust', FALSE, '2023-07-02 13:45:00+00', '2024-03-06 20:10:00+00'),
('community', 'https://github.com/onlydust/community', 'Community resources and discussion forums', 480, 65, 8, 'JavaScript', 'onlydust', FALSE, '2023-08-19 10:50:00+00', '2024-03-04 08:35:00+00'),
('data-analytics', 'https://github.com/onlydust/data-analytics', 'Data analytics and visualization tools', 780, 120, 22, 'Python', 'onlydust', FALSE, '2023-09-30 16:15:00+00', '2024-03-03 12:55:00+00'); 