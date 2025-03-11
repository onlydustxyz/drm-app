import { ActiveDevsChart } from "@/components/charts/dashboard-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarClock, DollarSign, Users } from "lucide-react";
import { getDashboardKPIs, getDeveloperActivity } from "@/lib/dashboard-service";
import { Suspense } from "react";

export default async function DashboardPage() {
	// Fetch data for the dashboard
	const kpis = await getDashboardKPIs();
	const developerActivity = await getDeveloperActivity();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Overview of your CRM activities and metrics.</p>
			</div>
			<Separator />

			<div className="space-y-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
							<CardTitle className="text-sm font-medium">Total Repos</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{kpis.totalRepos}</div>
							<p className="text-xs text-muted-foreground">+{kpis.totalReposGrowth}% from last month</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Commits</CardTitle>
							<CalendarClock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{kpis.totalCommits.toLocaleString()}</div>
							<p className="text-xs text-muted-foreground">+{kpis.totalCommitsGrowth}% from last month</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 grid-cols-1">
					<Card>
						<CardHeader>
							<CardTitle>Monthly Active Developers</CardTitle>
							<CardDescription>Developer activity over the last year</CardDescription>
						</CardHeader>
						<CardContent className="h-[300px]">
							<Suspense fallback={<div>Loading chart...</div>}>
								<ActiveDevsChart data={developerActivity} />
							</Suspense>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
