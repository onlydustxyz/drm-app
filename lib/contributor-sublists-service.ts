// Contributor sublists data types
import { Contributor, getContributors } from "./contributors-service";
import { ContributorActivity } from "@/components/charts/github-activity-graph";

export interface ContributorSublist {
  id: string;
  name: string;
  description: string;
  contributorIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContributorRetention {
  month: string;
  activeCount: number;
  totalCount: number;
  retentionRate: number;
}

// Mock data implementation
const mockContributorSublists: ContributorSublist[] = [
  {
    id: "1",
    name: "Core Contributors",
    description: "Key contributors to the project",
    contributorIds: ["1", "3", "5"],
    createdAt: "2023-03-10",
    updatedAt: "2023-03-15"
  },
  {
    id: "2",
    name: "New Contributors",
    description: "Recently joined contributors",
    contributorIds: ["2", "4"],
    createdAt: "2023-03-12",
    updatedAt: "2023-03-14"
  }
];

// Mock retention data
export const generateRetentionData = (contributorIds: string[]): ContributorRetention[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return months.map((month, index) => {
    // Generate some mock retention data based on the month
    const totalCount = contributorIds.length;
    // Simulate some fluctuation in active contributors
    const activeCount = Math.max(1, Math.floor(totalCount * (0.7 + Math.sin(index / 2) * 0.3)));
    const retentionRate = (activeCount / totalCount) * 100;
    
    return {
      month,
      activeCount,
      totalCount,
      retentionRate
    };
  });
};

// Generate GitHub-style activity data for contributors
export const getContributorActivityData = async (contributorIds: string[]): Promise<ContributorActivity[]> => {
  // In a real implementation, this would fetch data from an API
  // For now, we'll generate mock data
  
  // Get contributors
  const allContributors = await getContributors();
  
  // Ensure we're comparing strings to strings for IDs
  const stringContributorIds = contributorIds.map(id => String(id));
  const contributors = allContributors.filter((c: Contributor) => 
    stringContributorIds.includes(String(c.id))
  );
  
  console.log("Activity data - contributor IDs:", stringContributorIds);
  console.log("Activity data - filtered contributors:", contributors);
  
  // Mock projects
  const mockProjects = ["core", "frontend", "api", "docs", "tests"];
  
  // Mock repositories
  const mockRepos = ["main-app", "backend-service", "ui-components", "documentation", "infrastructure"];
  
  // Generate weeks (last 24 weeks)
  const weeks: string[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 7));
    const year = date.getFullYear();
    const weekNum = Math.ceil((((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1) / 7);
    weeks.push(`${year}-${weekNum.toString().padStart(2, '0')}`);
  }
  
  // Generate activity data for each contributor
  return contributors.map((contributor: Contributor) => {
    // Assign 1-3 random projects to each contributor
    const numProjects = 1 + Math.floor(Math.random() * 3);
    const projects: string[] = [];
    for (let i = 0; i < numProjects; i++) {
      const project = mockProjects[Math.floor(Math.random() * mockProjects.length)];
      if (!projects.includes(project)) {
        projects.push(project);
      }
    }
    
    // Assign 1-3 random repositories to each contributor
    const numRepos = 1 + Math.floor(Math.random() * 3);
    const repos: string[] = [];
    for (let i = 0; i < numRepos; i++) {
      const repo = mockRepos[Math.floor(Math.random() * mockRepos.length)];
      if (!repos.includes(repo)) {
        repos.push(repo);
      }
    }
    
    // Generate weekly activity
    const weeklyActivity = weeks.map(week => {
      // Generate more activity for contributors with more PRs/commits
      const activityLevel = (contributor.prMerged + contributor.commits) / 50;
      const maxPRs = Math.max(1, Math.floor(activityLevel * 10));
      
      // 30% chance of no activity in a given week
      const hasActivity = Math.random() > 0.3;
      
      // Generate repo-specific PR counts
      const repoActivity = repos.map(repo => {
        // Each repo has a different chance of activity
        const repoHasActivity = hasActivity && Math.random() > 0.4;
        const repoPRCount = repoHasActivity ? Math.floor(Math.random() * (maxPRs / repos.length) + 1) : 0;
        
        return {
          name: repo,
          prCount: repoPRCount
        };
      });
      
      // Total PR count is the sum of all repo PR counts
      const totalPRCount = repoActivity.reduce((sum, repo) => sum + repo.prCount, 0);
      
      return {
        week,
        prCount: totalPRCount,
        repos: repoActivity
      };
    });
    
    return {
      id: contributor.id,
      name: contributor.name,
      avatar: contributor.avatar,
      projects,
      weeklyActivity
    };
  });
};

// Contributor sublists service interface
export interface ContributorSublistsService {
  getSublists(): Promise<ContributorSublist[]>;
  getSublist(id: string): Promise<ContributorSublist | undefined>;
  createSublist(sublist: Omit<ContributorSublist, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContributorSublist>;
  updateSublist(id: string, sublist: Partial<Omit<ContributorSublist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ContributorSublist | undefined>;
  deleteSublist(id: string): Promise<boolean>;
  getRetentionData(contributorIds: string[]): Promise<ContributorRetention[]>;
}

// Mock implementation of the contributor sublists service
export class MockContributorSublistsService implements ContributorSublistsService {
  private sublists: ContributorSublist[] = [...mockContributorSublists];
  
  async getSublists(): Promise<ContributorSublist[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.sublists;
  }

  async getSublist(id: string): Promise<ContributorSublist | undefined> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Ensure we're comparing strings
    const stringId = String(id);
    return this.sublists.find(sublist => String(sublist.id) === stringId);
  }

  async createSublist(sublist: Omit<ContributorSublist, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContributorSublist> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const now = new Date().toISOString().split('T')[0];
    const newSublist: ContributorSublist = {
      ...sublist,
      id: (this.sublists.length + 1).toString(),
      createdAt: now,
      updatedAt: now
    };
    
    this.sublists.push(newSublist);
    return newSublist;
  }

  async updateSublist(id: string, sublist: Partial<Omit<ContributorSublist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ContributorSublist | undefined> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Ensure we're comparing strings
    const stringId = String(id);
    const index = this.sublists.findIndex(s => String(s.id) === stringId);
    
    if (index === -1) {
      return undefined;
    }
    
    const now = new Date().toISOString().split('T')[0];
    const updatedSublist: ContributorSublist = {
      ...this.sublists[index],
      ...sublist,
      updatedAt: now
    };
    
    // Ensure contributor IDs are strings
    if (updatedSublist.contributorIds) {
      updatedSublist.contributorIds = updatedSublist.contributorIds.map(id => String(id));
    }
    
    this.sublists[index] = updatedSublist;
    return updatedSublist;
  }

  async deleteSublist(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const initialLength = this.sublists.length;
    this.sublists = this.sublists.filter(sublist => sublist.id !== id);
    
    return this.sublists.length < initialLength;
  }

  async getRetentionData(contributorIds: string[]): Promise<ContributorRetention[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Ensure we're using string IDs
    const stringContributorIds = contributorIds.map(id => String(id));
    return generateRetentionData(stringContributorIds);
  }
}

// Create a singleton instance of the service
const contributorSublistsService: ContributorSublistsService = new MockContributorSublistsService();

// Export functions that use the service
export async function getContributorSublists(): Promise<ContributorSublist[]> {
  return contributorSublistsService.getSublists();
}

export async function getContributorSublist(id: string): Promise<ContributorSublist | undefined> {
  return contributorSublistsService.getSublist(id);
}

export async function createContributorSublist(sublist: Omit<ContributorSublist, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContributorSublist> {
  return contributorSublistsService.createSublist(sublist);
}

export async function updateContributorSublist(id: string, sublist: Partial<Omit<ContributorSublist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ContributorSublist | undefined> {
  return contributorSublistsService.updateSublist(id, sublist);
}

export async function deleteContributorSublist(id: string): Promise<boolean> {
  return contributorSublistsService.deleteSublist(id);
}

export async function getContributorRetentionData(contributorIds: string[]): Promise<ContributorRetention[]> {
  // Ensure we're using string IDs consistently
  const stringContributorIds = contributorIds.map(id => String(id));
  return contributorSublistsService.getRetentionData(stringContributorIds);
} 