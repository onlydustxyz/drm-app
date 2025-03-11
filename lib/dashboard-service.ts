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
  month: string;
  activeDevs: number;
}

export interface DevelopersByChain {
  date: string;
  singleChain: number;
  multiChain: number;
}

export interface DashboardData {
  kpis: DashboardKPI;
  developerActivity: DeveloperActivity[];
  developersByChain: DevelopersByChain[];
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
    { month: "Jan", activeDevs: 35 },
    { month: "Feb", activeDevs: 38 },
    { month: "Mar", activeDevs: 40 },
    { month: "Apr", activeDevs: 42 },
    { month: "May", activeDevs: 45 },
    { month: "Jun", activeDevs: 42 },
    { month: "Jul", activeDevs: 44 },
    { month: "Aug", activeDevs: 48 },
    { month: "Sep", activeDevs: 50 },
    { month: "Oct", activeDevs: 52 },
    { month: "Nov", activeDevs: 50 },
    { month: "Dec", activeDevs: 53 }
  ],
  developersByChain: [
    { date: "2018-01", singleChain: 5, multiChain: 2 },
    { date: "2018-02", singleChain: 8, multiChain: 3 },
    { date: "2018-03", singleChain: 12, multiChain: 5 },
    { date: "2018-04", singleChain: 15, multiChain: 7 },
    { date: "2018-05", singleChain: 18, multiChain: 10 },
    { date: "2018-06", singleChain: 22, multiChain: 12 },
    { date: "2018-07", singleChain: 25, multiChain: 15 },
    { date: "2018-08", singleChain: 30, multiChain: 18 },
    { date: "2018-09", singleChain: 35, multiChain: 20 },
    { date: "2018-10", singleChain: 40, multiChain: 25 },
    { date: "2018-11", singleChain: 45, multiChain: 28 },
    { date: "2018-12", singleChain: 50, multiChain: 32 },
    { date: "2019-01", singleChain: 55, multiChain: 35 },
    { date: "2019-02", singleChain: 60, multiChain: 38 },
    { date: "2019-03", singleChain: 65, multiChain: 42 },
    { date: "2019-04", singleChain: 70, multiChain: 45 },
    { date: "2019-05", singleChain: 75, multiChain: 48 },
    { date: "2019-06", singleChain: 80, multiChain: 52 },
    { date: "2019-07", singleChain: 85, multiChain: 55 },
    { date: "2019-08", singleChain: 90, multiChain: 60 },
    { date: "2019-09", singleChain: 95, multiChain: 65 },
    { date: "2019-10", singleChain: 100, multiChain: 70 },
    { date: "2019-11", singleChain: 105, multiChain: 75 },
    { date: "2019-12", singleChain: 110, multiChain: 80 },
    { date: "2020-01", singleChain: 115, multiChain: 85 },
    { date: "2020-02", singleChain: 120, multiChain: 90 },
    { date: "2020-03", singleChain: 125, multiChain: 95 },
    { date: "2020-04", singleChain: 130, multiChain: 100 },
    { date: "2020-05", singleChain: 140, multiChain: 105 },
    { date: "2020-06", singleChain: 150, multiChain: 110 },
    { date: "2020-07", singleChain: 160, multiChain: 115 },
    { date: "2020-08", singleChain: 170, multiChain: 120 },
    { date: "2020-09", singleChain: 180, multiChain: 125 },
    { date: "2020-10", singleChain: 190, multiChain: 130 },
    { date: "2020-11", singleChain: 200, multiChain: 135 },
    { date: "2020-12", singleChain: 210, multiChain: 140 },
    { date: "2021-01", singleChain: 220, multiChain: 145 },
    { date: "2021-02", singleChain: 230, multiChain: 150 },
    { date: "2021-03", singleChain: 240, multiChain: 155 },
    { date: "2021-04", singleChain: 250, multiChain: 160 },
    { date: "2021-05", singleChain: 260, multiChain: 165 },
    { date: "2021-06", singleChain: 270, multiChain: 170 },
    { date: "2021-07", singleChain: 280, multiChain: 175 },
    { date: "2021-08", singleChain: 290, multiChain: 180 },
    { date: "2021-09", singleChain: 300, multiChain: 185 },
    { date: "2021-10", singleChain: 310, multiChain: 190 },
    { date: "2021-11", singleChain: 320, multiChain: 195 },
    { date: "2021-12", singleChain: 330, multiChain: 200 },
    { date: "2022-01", singleChain: 340, multiChain: 205 },
    { date: "2022-02", singleChain: 350, multiChain: 210 },
    { date: "2022-03", singleChain: 360, multiChain: 215 },
    { date: "2022-04", singleChain: 370, multiChain: 220 },
    { date: "2022-05", singleChain: 380, multiChain: 225 },
    { date: "2022-06", singleChain: 390, multiChain: 230 },
    { date: "2022-07", singleChain: 400, multiChain: 235 },
    { date: "2022-08", singleChain: 410, multiChain: 240 },
    { date: "2022-09", singleChain: 420, multiChain: 245 },
    { date: "2022-10", singleChain: 430, multiChain: 250 },
    { date: "2022-11", singleChain: 440, multiChain: 255 },
    { date: "2022-12", singleChain: 450, multiChain: 260 },
    { date: "2023-01", singleChain: 440, multiChain: 265 },
    { date: "2023-02", singleChain: 430, multiChain: 270 },
    { date: "2023-03", singleChain: 420, multiChain: 275 },
    { date: "2023-04", singleChain: 410, multiChain: 280 },
    { date: "2023-05", singleChain: 400, multiChain: 285 },
    { date: "2023-06", singleChain: 390, multiChain: 290 },
    { date: "2023-07", singleChain: 380, multiChain: 295 },
    { date: "2023-08", singleChain: 370, multiChain: 300 },
    { date: "2023-09", singleChain: 360, multiChain: 305 },
    { date: "2023-10", singleChain: 350, multiChain: 310 },
    { date: "2023-11", singleChain: 340, multiChain: 315 },
    { date: "2023-12", singleChain: 330, multiChain: 320 },
    { date: "2024-01", singleChain: 320, multiChain: 325 },
    { date: "2024-02", singleChain: 310, multiChain: 330 },
    { date: "2024-03", singleChain: 300, multiChain: 335 },
    { date: "2024-04", singleChain: 290, multiChain: 340 },
    { date: "2024-05", singleChain: 280, multiChain: 345 },
    { date: "2024-06", singleChain: 270, multiChain: 350 },
    { date: "2024-07", singleChain: 260, multiChain: 355 },
    { date: "2024-08", singleChain: 250, multiChain: 360 },
    { date: "2024-09", singleChain: 240, multiChain: 365 },
    { date: "2024-10", singleChain: 230, multiChain: 370 },
    { date: "2024-11", singleChain: 220, multiChain: 375 }
  ]
};

// Dashboard service interface
export interface DashboardService {
  getDashboardData(): Promise<DashboardData>;
  getDashboardKPIs(): Promise<DashboardKPI>;
  getDeveloperActivity(): Promise<DeveloperActivity[]>;
  getDevelopersByChain(): Promise<DevelopersByChain[]>;
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

  async getDevelopersByChain(): Promise<DevelopersByChain[]> {
    const data = await this.getDashboardData();
    return data.developersByChain;
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

export async function getDevelopersByChain(): Promise<DevelopersByChain[]> {
  return dashboardService.getDevelopersByChain();
}