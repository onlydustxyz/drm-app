// Repository sublists data types
import { Repository, getRepositories } from "./repositories-service";

export interface RepositorySublist {
  id: string;
  name: string;
  description: string;
  repositoryIds: string[];
  createdAt: string;
  updatedAt: string;
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
  private sublists: RepositorySublist[] = [...mockRepositorySublists];
  
  async getSublists(): Promise<RepositorySublist[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.sublists;
  }

  async getSublist(id: string): Promise<RepositorySublist | undefined> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Ensure we're comparing strings
    const stringId = String(id);
    return this.sublists.find(sublist => String(sublist.id) === stringId);
  }

  async createSublist(sublist: Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepositorySublist> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const now = new Date().toISOString().split('T')[0];
    const newSublist: RepositorySublist = {
      ...sublist,
      id: (this.sublists.length + 1).toString(),
      createdAt: now,
      updatedAt: now
    };
    
    this.sublists.push(newSublist);
    return newSublist;
  }

  async updateSublist(id: string, sublist: Partial<Omit<RepositorySublist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RepositorySublist | undefined> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Ensure we're comparing strings
    const stringId = String(id);
    const index = this.sublists.findIndex(s => String(s.id) === stringId);
    
    if (index === -1) {
      return undefined;
    }
    
    const now = new Date().toISOString().split('T')[0];
    const updatedSublist: RepositorySublist = {
      ...this.sublists[index],
      ...sublist,
      updatedAt: now
    };
    
    // Ensure repository IDs are strings
    if (updatedSublist.repositoryIds) {
      updatedSublist.repositoryIds = updatedSublist.repositoryIds.map(id => String(id));
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