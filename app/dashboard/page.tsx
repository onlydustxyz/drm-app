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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart3, CalendarClock, Code, DollarSign, FolderGit2, Users } from "lucide-react";
import { 
	getCommitsByDevType, 
	getDashboardKPIs, 
	getDevActivity, 
	getDeveloperActivity, 
	getDeveloperLocations, 
	getDevelopersByChain, 
	getMonthlyCommits, 
	getMonthlyPRsMerged 
} from "@/lib/dashboard-service";
import { Suspense } from "react";

export default async function DashboardPage() {
	// Fetch data for the dashboard
	const kpis = await getDashboardKPIs();
	const developerActivity = await getDeveloperActivity();
	const developersByChain = await getDevelopersByChain();
	const developerLocations = await getDeveloperLocations();
	const commitsByDevType = await getCommitsByDevType();
	const monthlyCommits = await getMonthlyCommits();
	const monthlyPRsMerged = await getMonthlyPRsMerged();
	const devActivity = await getDevActivity();

	return (
		<div className="space-y-6 w-full max-w-full">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Overview of your developer ecosystem metrics.</p>
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
