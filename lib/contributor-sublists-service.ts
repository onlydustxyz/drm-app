// Contributor sublists data types
import { Contributor } from "./contributors-service";

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
    
    return this.sublists.find(sublist => sublist.id === id);
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
    
    const index = this.sublists.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    const now = new Date().toISOString().split('T')[0];
    const updatedSublist: ContributorSublist = {
      ...this.sublists[index],
      ...sublist,
      updatedAt: now
    };
    
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
    
    return generateRetentionData(contributorIds);
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
  return contributorSublistsService.getRetentionData(contributorIds);
} 