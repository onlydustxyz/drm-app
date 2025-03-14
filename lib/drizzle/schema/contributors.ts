import { date, index, integer, jsonb, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

/**
 * Contributors table schema
 * Stores contributor information for the platform
 */
export const contributors = pgTable(
	"contributors",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		avatar: text("avatar").notNull(),
		handle: varchar("handle", { length: 100 }).notNull().unique(),
		type: varchar("type", { length: 50 }).notNull(), // Full-Time, Part-Time, One-Time
		tenure: varchar("tenure", { length: 50 }).notNull(), // Newcomer, Emerging, Established
		description: text("description").notNull(),
		location: varchar("location", { length: 255 }).notNull(),
		organizations: jsonb("organizations").notNull().$type<string[]>(),
		pr_merged: integer("pr_merged").notNull().default(0),
		pr_opened: integer("pr_opened").notNull().default(0),
		issues_opened: integer("issues_opened").notNull().default(0),
		issues_closed: integer("issues_closed").notNull().default(0),
		commits: integer("commits").notNull().default(0),
		last_active: date("last_active").notNull(),
		latest_commit: jsonb("latest_commit").notNull().$type<{
			message: string;
			date: string;
			url: string;
		}>(),
		social_links: jsonb("social_links").notNull().$type<{
			github?: string;
			twitter?: string;
			linkedin?: string;
			website?: string;
		}>(),
		activity_score: integer("activity_score").notNull().default(0),
		languages: jsonb("languages").notNull().$type<Array<{ name: string; percentage: number }>>(),
		reputation_score: integer("reputation_score").notNull().default(0),
		stars: integer("stars").notNull().default(0),
		followers: integer("followers").notNull().default(0),
		created_at: date("created_at").notNull().defaultNow(),
		updated_at: date("updated_at").notNull().defaultNow(),
	},
	(table) => {
		return {
			handleIdx: index("idx_contributors_handle").on(table.handle),
			nameIdx: index("idx_contributors_name").on(table.name),
			typeIdx: index("idx_contributors_type").on(table.type),
			tenureIdx: index("idx_contributors_tenure").on(table.tenure),
			starsIdx: index("idx_contributors_stars").on(table.stars),
			commitsIdx: index("idx_contributors_commits").on(table.commits),
			prMergedIdx: index("idx_contributors_pr_merged").on(table.pr_merged),
			lastActiveIdx: index("idx_contributors_last_active").on(table.last_active),
		};
	}
);
