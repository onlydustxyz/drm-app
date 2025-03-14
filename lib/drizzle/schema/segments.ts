import {index, integer, pgTable, serial, text, timestamp, unique, varchar} from "drizzle-orm/pg-core";

// Define the segments table schema
export const segments = pgTable(
    "segments",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            nameIdx: index("idx_segments_name").on(table.name),
        };
    }
);

// Define the segments_contributors join table schema
export const segmentsContributors = pgTable(
    "segments_contributors",
    {
        id: serial("id").primaryKey(),
        segment_id: integer("segment_id")
            .notNull()
            .references(() => segments.id, { onDelete: "cascade" }),
        contributor_github_login: varchar("contributor_github_login", { length: 255 }).notNull(),
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            segmentIdIdx: index("idx_segments_contributors_segment_id").on(table.segment_id),
            contributorGithubLoginIdx: index("idx_segments_contributors_github_login").on(table.contributor_github_login),
            uniqueIdx: unique("idx_segments_contributors_unique").on(table.segment_id, table.contributor_github_login),
        };
    }
);

// Define the segment_repositories join table schema
export const segmentRepositories = pgTable(
    "segment_repositories",
    {
        id: serial("id").primaryKey(),
        segment_id: integer("segment_id")
            .notNull()
            .references(() => segments.id, { onDelete: "cascade" }),
        repository_url: varchar("repository_url", { length: 255 }).notNull(),
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            segmentIdIdx: index("idx_segment_repositories_segment_id").on(table.segment_id),
            repositoryUrlIdx: index("idx_segment_repositories_repository_url").on(table.repository_url),
            uniqueIdx: unique("idx_segment_repositories_unique").on(table.segment_id, table.repository_url),
        };
    }
);