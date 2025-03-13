import { db } from "@/lib/drizzle";
import { contributorSublists } from "@/lib/drizzle/schema/contributor-sublists";
import { eq, sql } from "drizzle-orm";
import { createServer } from "http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import request from "supertest";

// Create a test server
const createTestServer = (handler: NextApiHandler) => {
	const server = createServer((req, res) => {
		return handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
	});
	return server;
};

describe("Contributor Sublists API", () => {
	// Clean up database before each test
	beforeEach(async () => {
		try {
			// Verify database connection before each test
			await db.execute(sql`SELECT 1`);
			// Clean up prior test data
			await db.delete(contributorSublists);
		} catch (error) {
			console.error("Database connection or cleanup error:", error);
			throw error;
		}
	});

	describe("POST /api/contributor-sublists", () => {
		it("should create a new contributor sublist", async () => {
			const newSublist = {
				name: "Test Sublist",
				description: "Test Description",
				contributorIds: ["1", "2", "3"],
			};

			const response = await request(createTestServer(require("@/app/api/contributor-sublists/route").POST))
				.post("/api/contributor-sublists")
				.send(newSublist);

			expect(response.status).toBe(201);
			expect(response.body).toMatchObject({
				name: newSublist.name,
				description: newSublist.description,
				contributorIds: newSublist.contributorIds,
			});
			expect(response.body.id).toBeDefined();
			expect(response.body.createdAt).toBeDefined();
			expect(response.body.updatedAt).toBeDefined();
		});

		it("should return 400 if name is missing", async () => {
			const response = await request(createTestServer(require("@/app/api/contributor-sublists/route").POST))
				.post("/api/contributor-sublists")
				.send({
					description: "Test Description",
					contributorIds: ["1", "2", "3"],
				});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("Sublist name is required");
		});
	});

	describe("GET /api/contributor-sublists", () => {
		it("should return all sublists", async () => {
			// Create test data
			const sublist1 = await db
				.insert(contributorSublists)
				.values({
					name: "Test Sublist 1",
					description: "Description 1",
					contributor_ids: ["1", "2"],
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			const sublist2 = await db
				.insert(contributorSublists)
				.values({
					name: "Test Sublist 2",
					description: "Description 2",
					contributor_ids: ["3", "4"],
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			const response = await request(createTestServer(require("@/app/api/contributor-sublists/route").GET)).get(
				"/api/contributor-sublists"
			);

			expect(response.status).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0]).toMatchObject({
				name: "Test Sublist 1",
				description: "Description 1",
				contributorIds: ["1", "2"],
			});
			expect(response.body[1]).toMatchObject({
				name: "Test Sublist 2",
				description: "Description 2",
				contributorIds: ["3", "4"],
			});
		});

		it("should filter sublists by search query", async () => {
			// Create test data
			await db.insert(contributorSublists).values({
				name: "Frontend Team",
				description: "Frontend developers",
				contributor_ids: ["1", "2"],
				created_at: new Date(),
				updated_at: new Date(),
			});

			await db.insert(contributorSublists).values({
				name: "Backend Team",
				description: "Backend developers",
				contributor_ids: ["3", "4"],
				created_at: new Date(),
				updated_at: new Date(),
			});

			const response = await request(createTestServer(require("@/app/api/contributor-sublists/route").GET)).get(
				"/api/contributor-sublists?search=front"
			);

			expect(response.status).toBe(200);
			expect(response.body).toHaveLength(1);
			expect(response.body[0].name).toBe("Frontend Team");
		});
	});

	describe("GET /api/contributor-sublists/[id]", () => {
		it("should return a specific sublist", async () => {
			// Create test data
			const [sublist] = await db
				.insert(contributorSublists)
				.values({
					name: "Test Sublist",
					description: "Test Description",
					contributor_ids: ["1", "2"],
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			const response = await request(
				createTestServer(require("@/app/api/contributor-sublists/[id]/route").GET)
			).get(`/api/contributor-sublists/${sublist.id}`);

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				name: "Test Sublist",
				description: "Test Description",
				contributorIds: ["1", "2"],
			});
		});

		it("should return 404 for non-existent sublist", async () => {
			const response = await request(
				createTestServer(require("@/app/api/contributor-sublists/[id]/route").GET)
			).get("/api/contributor-sublists/999");

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Contributor sublist not found");
		});
	});

	describe("PUT /api/contributor-sublists/[id]", () => {
		it("should update an existing sublist", async () => {
			// Create test data
			const [sublist] = await db
				.insert(contributorSublists)
				.values({
					name: "Original Name",
					description: "Original Description",
					contributor_ids: ["1", "2"],
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			const updateData = {
				name: "Updated Name",
				description: "Updated Description",
				contributorIds: ["3", "4"],
			};

			const response = await request(createTestServer(require("@/app/api/contributor-sublists/[id]/route").PUT))
				.put(`/api/contributor-sublists/${sublist.id}`)
				.send(updateData);

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				name: updateData.name,
				description: updateData.description,
				contributorIds: updateData.contributorIds,
			});
		});

		it("should return 404 for non-existent sublist", async () => {
			const response = await request(createTestServer(require("@/app/api/contributor-sublists/[id]/route").PUT))
				.put("/api/contributor-sublists/999")
				.send({
					name: "Updated Name",
					description: "Updated Description",
					contributorIds: ["3", "4"],
				});

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Contributor sublist not found");
		});
	});

	describe("DELETE /api/contributor-sublists/[id]", () => {
		it("should delete an existing sublist", async () => {
			// Create test data
			const [sublist] = await db
				.insert(contributorSublists)
				.values({
					name: "Test Sublist",
					description: "Test Description",
					contributor_ids: ["1", "2"],
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			const response = await request(
				createTestServer(require("@/app/api/contributor-sublists/[id]/route").DELETE)
			).delete(`/api/contributor-sublists/${sublist.id}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);

			// Verify the sublist was deleted
			const deletedSublist = await db
				.select()
				.from(contributorSublists)
				.where(eq(contributorSublists.id, sublist.id));
			expect(deletedSublist).toHaveLength(0);
		});

		it("should return 404 for non-existent sublist", async () => {
			const response = await request(
				createTestServer(require("@/app/api/contributor-sublists/[id]/route").DELETE)
			).delete("/api/contributor-sublists/999");

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Contributor sublist not found");
		});
	});
});
