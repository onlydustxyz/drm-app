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

-- Developers by Chain table
CREATE TABLE IF NOT EXISTS developers_by_chain (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    single_chain INTEGER NOT NULL,
    multi_chain INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

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

-- Monthly Commits table
CREATE TABLE IF NOT EXISTS monthly_commits (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Monthly PRs Merged table
CREATE TABLE IF NOT EXISTS monthly_prs_merged (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

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

-- Create indexes
CREATE INDEX idx_developers_by_chain_date ON developers_by_chain(date);
CREATE INDEX idx_monthly_commits_date ON monthly_commits(date);
CREATE INDEX idx_monthly_prs_merged_date ON monthly_prs_merged(date);
CREATE INDEX idx_dev_activity_date ON dev_activity(date);

-- Enable RLS (Row Level Security)
ALTER TABLE dashboard_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers_by_chain ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE commits_by_dev_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_prs_merged ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- These policies allow only authenticated users to view the dashboard data
CREATE POLICY "Dashboard data is viewable by authenticated users" ON dashboard_kpis
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Developer activity is viewable by authenticated users" ON developer_activity
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Developers by chain is viewable by authenticated users" ON developers_by_chain
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Developer locations is viewable by authenticated users" ON developer_locations
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Commits by dev type is viewable by authenticated users" ON commits_by_dev_type
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Monthly commits is viewable by authenticated users" ON monthly_commits
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Monthly PRs merged is viewable by authenticated users" ON monthly_prs_merged
    FOR SELECT USING (auth.role() = 'authenticated');
    
CREATE POLICY "Dev activity is viewable by authenticated users" ON dev_activity
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create update policies for service role
-- These policies allow the service role to update the dashboard data
CREATE POLICY "Dashboard data is editable by service role" ON dashboard_kpis
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    
CREATE POLICY "Developer activity is editable by service role" ON developer_activity
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    
CREATE POLICY "Developers by chain is editable by service role" ON developers_by_chain
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    
CREATE POLICY "Developer locations is editable by service role" ON developer_locations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    
CREATE POLICY "Commits by dev type is editable by service role" ON commits_by_dev_type
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    
CREATE POLICY "Monthly commits is editable by service role" ON monthly_commits
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    
CREATE POLICY "Monthly PRs merged is editable by service role" ON monthly_prs_merged
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    
CREATE POLICY "Dev activity is editable by service role" ON dev_activity
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

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