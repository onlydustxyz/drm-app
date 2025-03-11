import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, CalendarClock, ContactIcon, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Overview of your CRM activities and metrics.</p>
			</div>
			<Separator />

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
						<ContactIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">254</div>
						<p className="text-xs text-muted-foreground">+4.2% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Companies</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">45</div>
						<p className="text-xs text-muted-foreground">+2.1% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Deals</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<p className="text-xs text-muted-foreground">+12.5% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$45,231.89</div>
						<p className="text-xs text-muted-foreground">+20.1% from last month</p>
					</CardContent>
				</Card>
			</div>

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
										<p className="text-sm text-muted-foreground">{30 - i * 3} minutes ago</p>
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
										<p className="text-sm font-medium leading-none">Follow up with Client {i}</p>
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
		</div>
	);
}
