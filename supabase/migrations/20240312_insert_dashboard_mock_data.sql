-- Insert mock data for dashboard tables

-- Insert mock data for dashboard_kpis
INSERT INTO dashboard_kpis 
(full_time_devs, full_time_devs_growth, monthly_active_devs, monthly_active_devs_growth, 
 total_repos, total_repos_growth, total_commits, total_commits_growth, 
 total_projects, total_projects_growth)
VALUES
(1250, 5.75, 2800, 12.50, 3450, 8.25, 125000, 15.30, 850, 10.45);

-- Insert mock data for developer_activity
INSERT INTO developer_activity
(name, full_time, part_time, on_time)
VALUES
('Jan 2024', 1250, 780, 1350),
('Feb 2024', 1275, 795, 1420),
('Mar 2024', 1310, 815, 1485),
('Apr 2024', 1345, 830, 1520),
('May 2024', 1380, 850, 1580);

-- Insert mock data for developers_by_chain
INSERT INTO developers_by_chain
(date, single_chain, multi_chain)
VALUES
('2024-01-01', 1850, 950),
('2024-02-01', 1890, 985),
('2024-03-01', 1920, 1020),
('2024-04-01', 1965, 1065),
('2024-05-01', 2010, 1120);

-- Insert mock data for developer_locations
INSERT INTO developer_locations
(country, count, latitude, longitude)
VALUES
('United States', 850, 37.090240, -95.712891),
('India', 620, 20.593683, 78.962883),
('United Kingdom', 380, 55.378052, -3.435973),
('Germany', 320, 51.165691, 10.451526),
('France', 280, 46.227638, 2.213749),
('Canada', 250, 56.130366, -106.346771),
('Australia', 220, -25.274399, 133.775131),
('Brazil', 185, -14.235004, -51.925282),
('Japan', 160, 36.204823, 138.252930),
('China', 140, 35.861660, 104.195396);

-- Insert mock data for commits_by_dev_type
INSERT INTO commits_by_dev_type
(name, full_time, part_time, on_time)
VALUES
('Jan 2024', 25000, 12500, 8500),
('Feb 2024', 26200, 13100, 8900),
('Mar 2024', 27500, 13800, 9400),
('Apr 2024', 28800, 14500, 9800),
('May 2024', 30200, 15200, 10300);

-- Insert mock data for monthly_commits
INSERT INTO monthly_commits
(date, count)
VALUES
('2023-12-01', 42500),
('2024-01-01', 46000),
('2024-02-01', 48200),
('2024-03-01', 50700),
('2024-04-01', 53100),
('2024-05-01', 55700);

-- Insert mock data for monthly_prs_merged
INSERT INTO monthly_prs_merged
(date, count)
VALUES
('2023-12-01', 9600),
('2024-01-01', 10200),
('2024-02-01', 10800),
('2024-03-01', 11500),
('2024-04-01', 12200),
('2024-05-01', 13000);

-- Insert mock data for dev_activity
INSERT INTO dev_activity
(date, active, churned, reactivated)
VALUES
('2023-12-01', 2650, 310, 180),
('2024-01-01', 2720, 290, 210),
('2024-02-01', 2790, 270, 240),
('2024-03-01', 2850, 250, 260),
('2024-04-01', 2920, 230, 280),
('2024-05-01', 3000, 210, 290); 