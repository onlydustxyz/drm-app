import {boolean, index, integer, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

// Define the repositories table schema
export const repositories = pgTable(
	"repositories",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		url: varchar("url", { length: 255 }).notNull(),
		description: text("description"),
		stars: integer("stars").default(0),
		forks: integer("forks").default(0),
		open_issues: integer("open_issues").default(0),
		language: varchar("language", { length: 100 }),
		owner: varchar("owner", { length: 255 }).notNull(),
		is_fork: boolean("is_fork").default(false),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
		last_commit_at: timestamp("last_commit_at", { withTimezone: true }),
	},
	(table) => {
		return {
			ownerIdx: index("idx_repositories_owner").on(table.owner),
			languageIdx: index("idx_repositories_language").on(table.language),
			createdAtIdx: index("idx_repositories_created_at").on(table.created_at),
		};
	}
);
