"use client";

import { useState, useEffect } from "react";
import { 
  CommitsByDevType, 
  DevActivity, 
  DeveloperActivity, 
  DeveloperLocation, 
  DevelopersByChain, 
  MonthlyCommits, 
  MonthlyPRsMerged,
  DashboardKPI
} from "@/lib/dashboard-service";
import { DataSourceSelector, dataSources } from "./data-source-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CalendarClock, Code, DollarSign, FolderGit2, Users } from "lucide-react";
import { 
  ActiveDevsChart, 
  CommitsByDevTypeChart, 
  DevActivityChart, 
  DevTypeDistributionChart, 
  DeveloperLocationsMap, 
  DevelopersByChainChart, 
  MonthlyCommitsChart, 
  MonthlyPRsMergedChart 
} from "@/components/charts/dashboard-charts";
import { Suspense } from "react";

// Mock filtering function - in a real app, this would filter data based on the source
const filterDataBySource = <T,>(data: T[], sourceId: string): T[] => {
  // For demo purposes, we're just returning the original data
  // In a real app, you would filter the data based on the sourceId
  return data;
};

// Mock scaling function - simulates different data for different lists
const scaleKPIsBySource = (kpis: DashboardKPI, sourceId: string): DashboardKPI => {
  if (sourceId === "all") return kpis;
  
  // Apply a scaling factor based on the sourceId to simulate different data
  const scalingFactors: {[key: string]: number} = {
    // Contributor lists
    "active-contributors": 0.85,
    "full-time-devs": 0.45,
    "top-contributors": 0.25,
    "new-contributors": 0.15,
    "project-leads": 0.08,
    "community-contributors": 0.75,
    "backend-devs": 0.35,
    "frontend-devs": 0.40,
    "contract-devs": 0.20,
    
    // Project lists
    "active-projects": 0.70,
    "high-activity-projects": 0.40,
    "new-projects": 0.20,
    "ethereum-projects": 0.45,
    "solana-projects": 0.25,
    "polkadot-projects": 0.15,
    "near-projects": 0.10,
    "cosmos-projects": 0.12,
    "defi-projects": 0.30,
    "nft-projects": 0.18
  };
  
  const factor = scalingFactors[sourceId] || 1;
  
  return {
    ...kpis,
    fullTimeDevs: Math.round(kpis.fullTimeDevs * factor),
    monthlyActiveDevs: Math.round(kpis.monthlyActiveDevs * factor),
    totalProjects: Math.round(kpis.totalProjects * factor),
    totalCommits: Math.round(kpis.totalCommits * factor)
  };
};

interface DashboardClientProps {
  kpis: DashboardKPI;
  developerActivity: DeveloperActivity[];
  developersByChain: DevelopersByChain[];
  developerLocations: DeveloperLocation[];
  commitsByDevType: CommitsByDevType[];
  monthlyCommits: MonthlyCommits[];
  monthlyPRsMerged: MonthlyPRsMerged[];
  devActivity: DevActivity[];
}

export function DashboardClient({
  kpis: initialKpis,
  developerActivity: initialDeveloperActivity,
  developersByChain: initialDevelopersByChain,
  developerLocations: initialDeveloperLocations,
  commitsByDevType: initialCommitsByDevType,
  monthlyCommits: initialMonthlyCommits,
  monthlyPRsMerged: initialMonthlyPRsMerged,
  devActivity: initialDevActivity
}: DashboardClientProps) {
  const [sourceId, setSourceId] = useState<string>("all");
  const selectedSource = dataSources.find(source => source.id === sourceId);
  
  // Mock contributor counts for each list
  const contributorCounts: {[key: string]: number} = {
    "all": 1250,
    "active-contributors": 875,
    "full-time-devs": 450,
    "top-contributors": 100,
    "new-contributors": 180,
    "project-leads": 45,
    "community-contributors": 825,
    "backend-devs": 380,
    "frontend-devs": 420,
    "contract-devs": 210,
    "active-projects": 650,
    "high-activity-projects": 320,
    "new-projects": 95,
    "ethereum-projects": 480,
    "solana-projects": 280,
    "polkadot-projects": 150,
    "near-projects": 85,
    "cosmos-projects": 110,
    "defi-projects": 350,
    "nft-projects": 220
  };
  
  // Mock project counts for each list
  const projectCounts: {[key: string]: number} = {
    "all": 87,
    "active-contributors": 65,
    "full-time-devs": 42,
    "top-contributors": 35,
    "new-contributors": 28,
    "project-leads": 22,
    "community-contributors": 60,
    "backend-devs": 45,
    "frontend-devs": 50,
    "contract-devs": 30,
    "active-projects": 45,
    "high-activity-projects": 25,
    "new-projects": 18,
    "ethereum-projects": 35,
    "solana-projects": 22,
    "polkadot-projects": 15,
    "near-projects": 8,
    "cosmos-projects": 12,
    "defi-projects": 28,
    "nft-projects": 20
  };
  
  // Filter data based on selected source
  const kpis = scaleKPIsBySource(initialKpis, sourceId);
  const developerActivity = filterDataBySource(initialDeveloperActivity, sourceId);
  const developersByChain = filterDataBySource(initialDevelopersByChain, sourceId);
  const developerLocations = filterDataBySource(initialDeveloperLocations, sourceId);
  const commitsByDevType = filterDataBySource(initialCommitsByDevType, sourceId);
  const monthlyCommits = filterDataBySource(initialMonthlyCommits, sourceId);
  const monthlyPRsMerged = filterDataBySource(initialMonthlyPRsMerged, sourceId);
  const devActivity = filterDataBySource(initialDevActivity, sourceId);

  const handleSourceChange = (newSourceId: string) => {
    setSourceId(newSourceId);
  };

  // Determine what count to show based on the selected source type
  const getCountBadge = () => {
    if (!selectedSource) return null;
    
    if (selectedSource.type === 'project-list') {
      return (
        <Badge variant="outline" className="ml-2">
          {projectCounts[sourceId]} projects
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="ml-2">
          {contributorCounts[sourceId]} contributors
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            {getCountBadge()}
          </div>
          <p className="text-muted-foreground">
            Metrics for your developer ecosystem, filtered by {selectedSource?.type === 'project-list' ? 'project' : 'contributor'} lists.
            {selectedSource?.description && (
              <span className="ml-1 text-sm italic">
                ({selectedSource.description})
              </span>
            )}
          </p>
        </div>
        <DataSourceSelector onSourceChange={handleSourceChange} />
      </div>
      <Separator />

      <div className="space-y-6 w-full max-w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full-Time Devs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.fullTimeDevs}</div>
              <p className="text-xs text-muted-foreground">+{kpis.fullTimeDevsGrowth}% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Active Devs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.monthlyActiveDevs}</div>
              <p className="text-xs text-muted-foreground">+{kpis.monthlyActiveDevsGrowth}% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderGit2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalProjects}</div>
              <p className="text-xs text-muted-foreground">+{kpis.totalProjectsGrowth}% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalCommits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{kpis.totalCommitsGrowth}% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Developer Types Distribution</CardTitle>
              <CardDescription>Active full-time, part-time, and one-time developers over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<div>Loading chart...</div>}>
                <DevTypeDistributionChart data={developerActivity} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Developer Locations</CardTitle>
              <CardDescription>Geographic distribution of developers</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<div>Loading chart...</div>}>
                <DeveloperLocationsMap data={developerLocations} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Commits by Developer Type</CardTitle>
              <CardDescription>Contribution distribution by developer type</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<div>Loading chart...</div>}>
                <CommitsByDevTypeChart data={commitsByDevType} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Monthly Commits</CardTitle>
              <CardDescription>Commit activity over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<div>Loading chart...</div>}>
                <MonthlyCommitsChart data={monthlyCommits} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Monthly PRs Merged</CardTitle>
              <CardDescription>Pull request activity over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<div>Loading chart...</div>}>
                <MonthlyPRsMergedChart data={monthlyPRsMerged} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Developer Activity</CardTitle>
              <CardDescription>Active, churned, and reactivated developers</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<div>Loading chart...</div>}>
                <DevActivityChart data={devActivity} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Active Developers by Chain Type</CardTitle>
              <CardDescription>Single chain vs. multi-chain developers over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Suspense fallback={<div>Loading chart...</div>}>
                <DevelopersByChainChart data={developersByChain} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 