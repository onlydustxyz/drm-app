import {date, decimal, index, integer, pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";

// Dashboard KPIs table
export const dashboardKpis = pgTable("dashboard_kpis", {
	id: serial("id").primaryKey(),
	full_time_devs: integer("full_time_devs").notNull(),
	full_time_devs_growth: decimal("full_time_devs_growth", { precision: 5, scale: 2 }).notNull(),
	monthly_active_devs: integer("monthly_active_devs").notNull(),
	monthly_active_devs_growth: decimal("monthly_active_devs_growth", { precision: 5, scale: 2 }).notNull(),
	total_repos: integer("total_repos").notNull(),
	total_repos_growth: decimal("total_repos_growth", { precision: 5, scale: 2 }).notNull(),
	total_commits: integer("total_commits").notNull(),
	total_commits_growth: decimal("total_commits_growth", { precision: 5, scale: 2 }).notNull(),
	total_projects: integer("total_projects").notNull(),
	total_projects_growth: decimal("total_projects_growth", { precision: 5, scale: 2 }).notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Developer Activity table
export const developerActivity = pgTable("developer_activity", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 50 }).notNull(),
	full_time: integer("full_time").notNull(),
	part_time: integer("part_time").notNull(),
	on_time: integer("on_time").notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Commits by Developer Type table
export const commitsByDevType = pgTable("commits_by_dev_type", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 50 }).notNull(),
	full_time: integer("full_time").notNull(),
	part_time: integer("part_time").notNull(),
	on_time: integer("on_time").notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Monthly Commits table
export const monthlyCommits = pgTable(
	"monthly_commits",
	{
		id: serial("id").primaryKey(),
		date: date("date").notNull(),
		count: integer("count").notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			dateIdx: index("idx_monthly_commits_date").on(table.date),
		};
	}
);

// Monthly PRs Merged table
export const monthlyPRsMerged = pgTable(
	"monthly_prs_merged",
	{
		id: serial("id").primaryKey(),
		date: date("date").notNull(),
		count: integer("count").notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			dateIdx: index("idx_monthly_prs_merged_date").on(table.date),
		};
	}
);

// Developer Activity Stats table
export const devActivity = pgTable(
	"dev_activity",
	{
		id: serial("id").primaryKey(),
		date: date("date").notNull(),
		active: integer("active").notNull(),
		churned: integer("churned").notNull(),
		reactivated: integer("reactivated").notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			dateIdx: index("idx_dev_activity_date").on(table.date),
		};
	}
);
