import { dbFactory } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema/users";
import { User } from "@/lib/services/authentication-service";
import { UsersStorage } from "@/lib/storage/users-storage";
import { eq } from "drizzle-orm";

/**
 * Drizzle ORM implementation of the UsersStorage interface
 */
export class DrizzleUsersStorage implements UsersStorage {
  constructor() {
    // No additional setup needed for Drizzle as it uses the singleton db instance
  }

  /**
   * Transform a database record to our service model
   */
  private transformDbToModel(dbUser: any): User {
    return {
      id: dbUser.id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as 'admin' | 'user',
      createdAt: dbUser.created_at?.toISOString() || new Date().toISOString(),
    };
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const result = await dbFactory.getClient()
        .select()
        .from(users);

      return result.map(this.transformDbToModel);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User | undefined> {
    try {
      const result = await dbFactory.getClient()
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      return result.length > 0 ? this.transformDbToModel(result[0]) : undefined;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
  }

  /**
   * Get a user by email
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await dbFactory.getClient()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return result.length > 0 ? this.transformDbToModel(result[0]) : undefined;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw new Error(`Failed to fetch user with email ${email}`);
    }
  }

  /**
   * Create a new user
   */
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    try {
      const now = new Date();

      const result = await dbFactory.getClient()
        .insert(users)
        .values({
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: now,
          updated_at: now,
        })
        .returning();

      if (!result[0]) {
        throw new Error("Failed to create user");
      }

      return this.transformDbToModel(result[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, user: Partial<Omit<User, "id" | "createdAt">>): Promise<User | undefined> {
    try {
      const updates: any = {};

      if (user.name !== undefined) updates.name = user.name;
      if (user.email !== undefined) updates.email = user.email;
      if (user.role !== undefined) updates.role = user.role;

      // Always update the updated_at timestamp
      updates.updated_at = new Date();

      const result = await dbFactory.getClient()
        .update(users)
        .set(updates)
        .where(eq(users.id, parseInt(id)))
        .returning();

      return result.length > 0 ? this.transformDbToModel(result[0]) : undefined;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw new Error(`Failed to update user with ID ${id}`);
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await dbFactory.getClient()
        .delete(users)
        .where(eq(users.id, parseInt(id)))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw new Error(`Failed to delete user with ID ${id}`);
    }
  }
}