import { ActiveDevsChart, ContactGrowthChart, DealStageChart } from "@/components/charts/dashboard-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Overview of your CRM activities and metrics.</p>
			</div>
			<Separator />

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="activities">Activities</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Full-Time Devs</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">42</div>
								<p className="text-xs text-muted-foreground">+3.5% from last month</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Monthly Active Devs</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">128</div>
								<p className="text-xs text-muted-foreground">+7.2% from last month</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Repos</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">87</div>
								<p className="text-xs text-muted-foreground">+4.3% from last month</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Commits</CardTitle>
								<CalendarClock className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">12,547</div>
								<p className="text-xs text-muted-foreground">+15.8% from last month</p>
							</CardContent>
						</Card>
					</div>

					<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Monthly Active Developers</CardTitle>
								<CardDescription>Developer activity over the last year</CardDescription>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ActiveDevsChart />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Deal Stage Distribution</CardTitle>
								<CardDescription>Current deals by stage</CardDescription>
							</CardHeader>
							<CardContent className="h-[300px]">
								<DealStageChart />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="analytics" className="space-y-6">
					<div className="grid gap-4 grid-cols-1">
						<Card>
							<CardHeader>
								<CardTitle>Contact Growth</CardTitle>
								<CardDescription>New vs lost contacts per month</CardDescription>
							</CardHeader>
							<CardContent className="h-[400px]">
								<ContactGrowthChart />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="activities" className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Recent Activities</CardTitle>
								<CardDescription>Your recent activities in the last 30 days</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[1, 2, 3, 4, 5].map((i) => (
										<div className="flex items-center" key={i}>
											<div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
												<CalendarClock className="h-5 w-5 text-primary" />
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium leading-none">Call with Client {i}</p>
												<p className="text-sm text-muted-foreground">
													{30 - i * 3} minutes ago
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Upcoming Tasks</CardTitle>
								<CardDescription>Tasks scheduled for the next 7 days</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[1, 2, 3, 4].map((i) => (
										<div className="flex items-center" key={i}>
											<div className="space-y-1">
												<p className="text-sm font-medium leading-none">
													Follow up with Client {i}
												</p>
												<p className="text-sm text-muted-foreground">
													Due in {i} day{i > 1 ? "s" : ""}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
