// Repository sublists data types
import { Repository, getRepositories } from "./repositories-service";
import { ContributorActivity } from "@/components/charts/github-activity-graph";

export interface RepositorySublist {
  id: string;
  name: string;
  description: string;
  repositoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryRetention {
  month: string;
  activeCount: number;
  totalCount: number;
  retentionRate: number;
}

// Mock data implementation
const mockRepositorySublists: RepositorySublist[] = [
  {
    id: "1",
    name: "Core Repositories",
    description: "Key repositories in the project",
    repositoryIds: ["1", "3", "5"],
    createdAt: "2023-03-10",
    updatedAt: "2023-03-15"
  },
  {
    id: "2",
    name: "New Repositories",
    description: "Recently added repositories",
    repositoryIds: ["2", "4"],
    createdAt: "2023-03-12",
    updatedAt: "2023-03-14"
  }
];

// Repository sublists service interface
export interface RepositorySublistsService {
  getSublists(): Promise<RepositorySublist[]>;
  getSublist(id: string): Promise<RepositorySublist | undefined>;
  createSublist(sublist: Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepositorySublist>;
  updateSublist(id: string, sublist: Partial<Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RepositorySublist | undefined>;
  deleteSublist(id: string): Promise<boolean>;
}

// Mock implementation of the repository sublists service
export class MockRepositorySublistsService implements RepositorySublistsService {
  async getSublists(): Promise<RepositorySublist[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for now
    return mockRepositorySublists;
  }

  async getSublist(id: string): Promise<RepositorySublist | undefined> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find and return the sublist with the matching ID
    return mockRepositorySublists.find(sublist => sublist.id === id);
  }

  async createSublist(sublist: Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepositorySublist> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Create a new sublist with a generated ID and timestamps
    const newSublist: RepositorySublist = {
      id: (mockRepositorySublists.length + 1).toString(),
      ...sublist,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock data
    mockRepositorySublists.push(newSublist);
    
    return newSublist;
  }

  async updateSublist(id: string, sublist: Partial<Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RepositorySublist | undefined> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find the sublist to update
    const index = mockRepositorySublists.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    // Update the sublist
    const updatedSublist: RepositorySublist = {
      ...mockRepositorySublists[index],
      ...sublist,
      updatedAt: new Date().toISOString()
    };
    
    // Replace in mock data
    mockRepositorySublists[index] = updatedSublist;
    
    return updatedSublist;
  }

  async deleteSublist(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find the sublist to delete
    const index = mockRepositorySublists.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    // Remove from mock data
    mockRepositorySublists.splice(index, 1);
    
    return true;
  }
}

// Create a singleton instance of the service
const repositorySublistsService: RepositorySublistsService = new MockRepositorySublistsService();

// Export functions that use the service
export async function getRepositorySublists(): Promise<RepositorySublist[]> {
  return repositorySublistsService.getSublists();
}

export async function getRepositorySublist(id: string): Promise<RepositorySublist | undefined> {
  return repositorySublistsService.getSublist(id);
}

export async function createRepositorySublist(sublist: Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepositorySublist> {
  return repositorySublistsService.createSublist(sublist);
}

export async function updateRepositorySublist(id: string, sublist: Partial<Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RepositorySublist | undefined> {
  return repositorySublistsService.updateSublist(id, sublist);
}

export async function deleteRepositorySublist(id: string): Promise<boolean> {
  return repositorySublistsService.deleteSublist(id);
}

// Mock activity data for repositories
export async function getRepositoryActivityData(sublistId: string): Promise<ContributorActivity[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get the sublist
  const sublist = await getRepositorySublist(sublistId);
  if (!sublist) return [];
  
  // Generate mock activity data
  const currentDate = new Date();
  const weeks: string[] = [];
  
  // Generate weeks for the last 52 weeks
  for (let i = 0; i < 52; i++) {
    const weekDate = new Date(currentDate);
    weekDate.setDate(currentDate.getDate() - (i * 7));
    weeks.push(weekDate.toISOString().split('T')[0]);
  }
  
  // Get repositories in the sublist
  const allRepositories = await getRepositories();
  const repositories = allRepositories.filter(repo => 
    sublist.repositoryIds.includes(repo.id)
  );
  
  // Generate data for each repository with weekly activity
  return repositories.map(repo => {
    const weeklyActivity = weeks.map(week => {
      // Generate random PR count
      const prCount = Math.floor(Math.random() * 10);
      
      // Generate random repos data
      const repos = [
        {
          name: "main-repo",
          prCount: Math.floor(prCount * 0.7) // 70% of PRs in main repo
        },
        {
          name: "secondary-repo",
          prCount: Math.floor(prCount * 0.3) // 30% of PRs in secondary repo
        }
      ].filter(r => r.prCount > 0); // Only include repos with PRs
      
      return {
        week,
        prCount,
        repos
      };
    });
    
    return {
      id: repo.id,
      name: repo.name,
      avatar: `https://github.com/${repo.name.split('/')[0]}.png`,
      projects: ["Project A", "Project B"],
      weeklyActivity
    };
  });
}

// Mock retention data for repositories
export async function getRepositoryRetentionData(sublistId: string): Promise<RepositoryRetention[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Get the sublist
  const sublist = await getRepositorySublist(sublistId);
  if (!sublist) return [];
  
  // Generate mock retention data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return months.map((month, index) => {
    // Generate some mock retention data based on the month
    const totalCount = Math.floor(Math.random() * 20) + 10; // Random total between 10-30
    // Simulate some fluctuation in active repositories
    const activeCount = Math.max(1, Math.floor(totalCount * (0.7 + Math.sin(index / 2) * 0.3)));
    const retentionRate = (activeCount / totalCount) * 100;
    
    return {
      month,
      activeCount,
      totalCount,
      retentionRate
    };
  });
} 