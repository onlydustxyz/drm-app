import { index, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Define the contributor sublists table schema
export const contributorSublists = pgTable(
	"contributor_sublists",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		description: text("description"),
		contributor_ids: jsonb("contributor_ids").$type<string[]>().notNull().default([]),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			nameIdx: index("idx_contributor_sublists_name").on(table.name),
			createdAtIdx: index("idx_contributor_sublists_created_at").on(table.created_at),
		};
	}
);

// Define the contributor retention table schema
export const contributorRetention = pgTable(
	"contributor_retention",
	{
		id: serial("id").primaryKey(),
		month: varchar("month", { length: 10 }).notNull(),
		active_count: integer("active_count").notNull(),
		total_count: integer("total_count").notNull(),
		retention_rate: integer("retention_rate").notNull(),
		contributor_ids: jsonb("contributor_ids").$type<string[]>().notNull().default([]),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			monthIdx: index("idx_contributor_retention_month").on(table.month),
		};
	}
);
