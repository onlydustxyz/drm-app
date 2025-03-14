/**
 * Authentication service interface
 * This service integrates with Supabase for authentication
 */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getUsersStorage } from "@/lib/storage/users-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  github: {
    login: string;
    avatarUrl: string;
  };
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthenticationService {
  getAuthenticatedUser(): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  updateUser(id: string, user: Partial<Omit<User, "id" | "createdAt">>): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGithubLogin(githubLogin: string): Promise<User | undefined>;
}

// Implementation of the authentication service using Supabase
class SupabaseAuthenticationService implements AuthenticationService {
  async getAuthenticatedUser(): Promise<User | null> {
    try {
      // Get the Supabase client for server-side use
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        }
      );
      
      // Get session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }
      
      const supabaseUser = session.user;
      
      // Check if we have a user record in our database
      const usersStorage = getUsersStorage();
      let user = await usersStorage.getUserByEmail(supabaseUser.email!);
      
      // If no user exists, create one
      if (!user) {
        const githubLogin = supabaseUser.user_metadata?.user_name || 
                            supabaseUser.user_metadata?.preferred_username || 
                            supabaseUser.email?.split('@')[0] || 
                            'user';
                            
        const newUser: Omit<User, "id" | "createdAt"> = {
          name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
          email: supabaseUser.email!,
          github: {
            login: githubLogin,
            avatarUrl: supabaseUser.user_metadata?.avatar_url || '',
          },
          role: 'user', // Default role
        };
        
        user = await usersStorage.createUser(newUser);
      }
      
      return user;
    } catch (error) {
      console.error("Error in getAuthenticatedUser:", error);
      return null;
    }
  }
  
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const usersStorage = getUsersStorage();
    return usersStorage.createUser(user);
  }
  
  async updateUser(id: string, user: Partial<Omit<User, "id" | "createdAt">>): Promise<User | undefined> {
    const usersStorage = getUsersStorage();
    return usersStorage.updateUser(id, user);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const usersStorage = getUsersStorage();
    return usersStorage.getUserByEmail(email);
  }
  
  async getUserByGithubLogin(githubLogin: string): Promise<User | undefined> {
    const usersStorage = getUsersStorage();
    return usersStorage.getUserByGithubLogin(githubLogin);
  }
}

// Singleton instance of the authentication service
const authenticationService: AuthenticationService = new SupabaseAuthenticationService();

// Export functions that use the service
export async function getAuthenticatedUser(): Promise<User | null> {
  return authenticationService.getAuthenticatedUser();
}

export async function createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  return authenticationService.createUser(user);
}

export async function updateUser(id: string, user: Partial<Omit<User, "id" | "createdAt">>): Promise<User | undefined> {
  return authenticationService.updateUser(id, user);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return authenticationService.getUserByEmail(email);
}

export async function getUserByGithubLogin(githubLogin: string): Promise<User | undefined> {
  return authenticationService.getUserByGithubLogin(githubLogin);
} 