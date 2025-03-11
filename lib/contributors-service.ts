// Contributors data types
export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  prMerged: number;
  prOpened: number;
  issuesOpened: number;
  issuesClosed: number;
  commits: number;
  lastActive: string;
}

// Mock data implementation
const mockContributors: Contributor[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://github.com/ghost.png",
    prMerged: 24,
    prOpened: 28,
    issuesOpened: 15,
    issuesClosed: 12,
    commits: 87,
    lastActive: "2023-03-15"
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "https://github.com/ghost.png",
    prMerged: 18,
    prOpened: 22,
    issuesOpened: 9,
    issuesClosed: 7,
    commits: 65,
    lastActive: "2023-03-14"
  },
  {
    id: "3",
    name: "Carol Williams",
    avatar: "https://github.com/ghost.png",
    prMerged: 32,
    prOpened: 35,
    issuesOpened: 20,
    issuesClosed: 18,
    commits: 112,
    lastActive: "2023-03-16"
  },
  {
    id: "4",
    name: "Dave Brown",
    avatar: "https://github.com/ghost.png",
    prMerged: 15,
    prOpened: 19,
    issuesOpened: 8,
    issuesClosed: 6,
    commits: 54,
    lastActive: "2023-03-13"
  },
  {
    id: "5",
    name: "Eve Davis",
    avatar: "https://github.com/ghost.png",
    prMerged: 28,
    prOpened: 30,
    issuesOpened: 17,
    issuesClosed: 15,
    commits: 95,
    lastActive: "2023-03-15"
  }
];

// Contributors service interface
export interface ContributorsService {
  getContributors(): Promise<Contributor[]>;
  getContributor(id: string): Promise<Contributor | undefined>;
}

// Mock implementation of the contributors service
export class MockContributorsService implements ContributorsService {
  async getContributors(): Promise<Contributor[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for now
    return mockContributors;
  }

  async getContributor(id: string): Promise<Contributor | undefined> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find and return the contributor with the matching ID
    return mockContributors.find(contributor => contributor.id === id);
  }
}

// Create a singleton instance of the service
const contributorsService: ContributorsService = new MockContributorsService();

// Export functions that use the service
export async function getContributors(): Promise<Contributor[]> {
  return contributorsService.getContributors();
}

export async function getContributor(id: string): Promise<Contributor | undefined> {
  return contributorsService.getContributor(id);
} 