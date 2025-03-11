// Dashboard data types
export interface DashboardKPI {
  fullTimeDevs: number;
  fullTimeDevsGrowth: number;
  monthlyActiveDevs: number;
  monthlyActiveDevsGrowth: number;
  totalRepos: number;
  totalReposGrowth: number;
  totalCommits: number;
  totalCommitsGrowth: number;
}

export interface DeveloperActivity {
  name: string;
  fullTime: number;
  partTime: number;
  onTime: number;
}

export interface DevelopersByCountry {
  code: string;
  value: number;
  name: string;
}

export interface DashboardData {
  kpis: DashboardKPI;
  developerActivity: DeveloperActivity[];
  developersByCountry: DevelopersByCountry[];
}

// Mock data implementation
const mockDashboardData: DashboardData = {
  kpis: {
    fullTimeDevs: 46,
    fullTimeDevsGrowth: 3.5,
    monthlyActiveDevs: 128,
    monthlyActiveDevsGrowth: 7.2,
    totalRepos: 87,
    totalReposGrowth: 4.3,
    totalCommits: 12547,
    totalCommitsGrowth: 15.8
  },
  developerActivity: [
    { name: "Jan", fullTime: 35, partTime: 30, onTime: 20 },
    { name: "Feb", fullTime: 38, partTime: 32, onTime: 22 },
    { name: "Mar", fullTime: 40, partTime: 35, onTime: 22 },
    { name: "Apr", fullTime: 42, partTime: 38, onTime: 25 },
    { name: "May", fullTime: 45, partTime: 40, onTime: 25 },
    { name: "Jun", fullTime: 42, partTime: 38, onTime: 22 },
    { name: "Jul", fullTime: 44, partTime: 40, onTime: 24 },
    { name: "Aug", fullTime: 48, partTime: 42, onTime: 25 },
    { name: "Sep", fullTime: 50, partTime: 45, onTime: 25 },
    { name: "Oct", fullTime: 52, partTime: 48, onTime: 25 },
    { name: "Nov", fullTime: 50, partTime: 47, onTime: 25 },
    { name: "Dec", fullTime: 53, partTime: 50, onTime: 25 }
  ],
  developersByCountry: [
    { code: "us", value: 149, name: "United States" },
    { code: "in", value: 126, name: "India" },
    { code: "cn", value: 85, name: "China" },
    { code: "gb", value: 72, name: "United Kingdom" },
    { code: "de", value: 65, name: "Germany" },
    { code: "fr", value: 58, name: "France" },
    { code: "ca", value: 47, name: "Canada" },
    { code: "au", value: 42, name: "Australia" },
    { code: "br", value: 38, name: "Brazil" },
    { code: "ru", value: 35, name: "Russia" },
    { code: "jp", value: 32, name: "Japan" },
    { code: "nl", value: 28, name: "Netherlands" },
    { code: "es", value: 25, name: "Spain" },
    { code: "it", value: 22, name: "Italy" },
    { code: "se", value: 18, name: "Sweden" },
    { code: "pl", value: 16, name: "Poland" },
    { code: "kr", value: 15, name: "South Korea" },
    { code: "za", value: 12, name: "South Africa" },
    { code: "mx", value: 10, name: "Mexico" },
    { code: "sg", value: 8, name: "Singapore" }
  ]
};

// Dashboard service interface
export interface DashboardService {
  getDashboardData(): Promise<DashboardData>;
  getDashboardKPIs(): Promise<DashboardKPI>;
  getDeveloperActivity(): Promise<DeveloperActivity[]>;
  getDevelopersByCountry(): Promise<DevelopersByCountry[]>;
}

// Mock implementation of the dashboard service
export class MockDashboardService implements DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for now
    return mockDashboardData;
  }

  async getDashboardKPIs(): Promise<DashboardKPI> {
    const data = await this.getDashboardData();
    return data.kpis;
  }

  async getDeveloperActivity(): Promise<DeveloperActivity[]> {
    const data = await this.getDashboardData();
    return data.developerActivity;
  }

  async getDevelopersByCountry(): Promise<DevelopersByCountry[]> {
    const data = await this.getDashboardData();
    return data.developersByCountry;
  }
}

// Create a singleton instance of the service
const dashboardService: DashboardService = new MockDashboardService();

// Export functions that use the service for backward compatibility
export async function getDashboardData(): Promise<DashboardData> {
  return dashboardService.getDashboardData();
}

export async function getDashboardKPIs(): Promise<DashboardKPI> {
  return dashboardService.getDashboardKPIs();
}

export async function getDeveloperActivity(): Promise<DeveloperActivity[]> {
  return dashboardService.getDeveloperActivity();
}

export async function getDevelopersByCountry(): Promise<DevelopersByCountry[]> {
  return dashboardService.getDevelopersByCountry();
}