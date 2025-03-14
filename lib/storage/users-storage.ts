import { User } from "@/lib/services/authentication-service";
import { DrizzleUsersStorage } from "@/lib/storage/adapters/users-storage-drizzle";

/**
 * Interface for accessing user data from storage
 */
export interface UsersStorage {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGithubLogin(githubLogin: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  updateUser(id: string, user: Partial<Omit<User, "id" | "createdAt">>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
}

// Factory function to get the appropriate storage implementation
export function getUsersStorage(): UsersStorage {
  return new DrizzleUsersStorage();
} 