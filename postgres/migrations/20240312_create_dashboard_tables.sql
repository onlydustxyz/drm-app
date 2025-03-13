-- Create dashboard tables migration

-- Dashboard KPIs table
CREATE TABLE IF NOT EXISTS dashboard_kpis (
    id SERIAL PRIMARY KEY,
    full_time_devs INTEGER NOT NULL,
    full_time_devs_growth DECIMAL(5,2) NOT NULL,
    monthly_active_devs INTEGER NOT NULL,
    monthly_active_devs_growth DECIMAL(5,2) NOT NULL,
    total_repos INTEGER NOT NULL,
    total_repos_growth DECIMAL(5,2) NOT NULL,
    total_commits INTEGER NOT NULL,
    total_commits_growth DECIMAL(5,2) NOT NULL,
    total_projects INTEGER NOT NULL,
    total_projects_growth DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for dashboard_kpis
INSERT INTO dashboard_kpis (full_time_devs, full_time_devs_growth, monthly_active_devs, monthly_active_devs_growth, 
                            total_repos, total_repos_growth, total_commits, total_commits_growth, 
                            total_projects, total_projects_growth)
VALUES (275, 12.50, 820, 8.75, 1250, 15.20, 28500, 22.40, 180, 9.80);

-- Developer Activity table
CREATE TABLE IF NOT EXISTS developer_activity (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    full_time INTEGER NOT NULL,
    part_time INTEGER NOT NULL,
    on_time INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for developer_activity
INSERT INTO developer_activity (name, full_time, part_time, on_time)
VALUES 
    ('Ethereum', 120, 85, 210),
    ('Solana', 75, 45, 115),
    ('Polkadot', 42, 28, 65),
    ('Avalanche', 38, 22, 58);

-- Developers by Chain table
CREATE TABLE IF NOT EXISTS developers_by_chain (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    single_chain INTEGER NOT NULL,
    multi_chain INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for developers_by_chain
INSERT INTO developers_by_chain (date, single_chain, multi_chain)
VALUES 
    ('2023-09-01', 350, 120),
    ('2023-10-01', 365, 135),
    ('2023-11-01', 380, 155),
    ('2023-12-01', 410, 180),
    ('2024-01-01', 425, 210),
    ('2024-02-01', 445, 225);

-- Developer Locations table
CREATE TABLE IF NOT EXISTS developer_locations (
    id SERIAL PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for developer_locations
INSERT INTO developer_locations (country, count, latitude, longitude)
VALUES 
    ('United States', 210, 37.090240, -95.712891),
    ('Germany', 85, 51.165691, 10.451526),
    ('United Kingdom', 75, 55.378051, -3.435973),
    ('India', 120, 20.593684, 78.962880),
    ('Canada', 45, 56.130366, -106.346771),
    ('Singapore', 28, 1.352083, 103.819836),
    ('Brazil', 35, -14.235004, -51.925280),
    ('Japan', 30, 36.204824, 138.252924);

-- Commits by Developer Type table
CREATE TABLE IF NOT EXISTS commits_by_dev_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    full_time INTEGER NOT NULL,
    part_time INTEGER NOT NULL,
    on_time INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for commits_by_dev_type
INSERT INTO commits_by_dev_type (name, full_time, part_time, on_time)
VALUES 
    ('Smart Contracts', 8500, 3200, 1800),
    ('Frontend Apps', 5400, 2700, 1150),
    ('Infrastructure', 4100, 1800, 850),
    ('Testing', 3600, 1500, 950);

-- Monthly Commits table
CREATE TABLE IF NOT EXISTS monthly_commits (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for monthly_commits
INSERT INTO monthly_commits (date, count)
VALUES 
    ('2023-09-01', 3200),
    ('2023-10-01', 3450),
    ('2023-11-01', 3150),
    ('2023-12-01', 2800),
    ('2024-01-01', 3600),
    ('2024-02-01', 4200),
    ('2024-03-01', 4550);

-- Monthly PRs Merged table
CREATE TABLE IF NOT EXISTS monthly_prs_merged (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for monthly_prs_merged
INSERT INTO monthly_prs_merged (date, count)
VALUES 
    ('2023-09-01', 1250),
    ('2023-10-01', 1350),
    ('2023-11-01', 1100),
    ('2023-12-01', 950),
    ('2024-01-01', 1400),
    ('2024-02-01', 1650),
    ('2024-03-01', 1750);

-- Developer Activity Stats table
CREATE TABLE IF NOT EXISTS dev_activity (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    active INTEGER NOT NULL,
    churned INTEGER NOT NULL,
    reactivated INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert mock data for dev_activity
INSERT INTO dev_activity (date, active, churned, reactivated)
VALUES 
    ('2023-09-01', 520, 35, 15),
    ('2023-10-01', 565, 28, 22),
    ('2023-11-01', 590, 42, 18),
    ('2023-12-01', 560, 55, 20),
    ('2024-01-01', 610, 30, 35),
    ('2024-02-01', 645, 25, 40),
    ('2024-03-01', 690, 20, 45);

-- Create indexes
CREATE INDEX idx_developers_by_chain_date ON developers_by_chain(date);
CREATE INDEX idx_monthly_commits_date ON monthly_commits(date);
CREATE INDEX idx_monthly_prs_merged_date ON monthly_prs_merged(date);
CREATE INDEX idx_dev_activity_date ON dev_activity(date);


-- Create triggers to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dashboard_kpis_updated_at
BEFORE UPDATE ON dashboard_kpis
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_developer_activity_updated_at
BEFORE UPDATE ON developer_activity
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_developers_by_chain_updated_at
BEFORE UPDATE ON developers_by_chain
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_developer_locations_updated_at
BEFORE UPDATE ON developer_locations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_commits_by_dev_type_updated_at
BEFORE UPDATE ON commits_by_dev_type
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_monthly_commits_updated_at
BEFORE UPDATE ON monthly_commits
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_monthly_prs_merged_updated_at
BEFORE UPDATE ON monthly_prs_merged
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_dev_activity_updated_at
BEFORE UPDATE ON dev_activity
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();