"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useDashboardKPIs } from "@/lib/react-query/dashboard";
import { ArrowDown, ArrowUp } from "lucide-react";

interface KPICardProps {
	title: string;
	value: number;
	growth?: number;
}

function KPICard({ title, value, growth }: KPICardProps) {
	return (
		<Card>
			<CardContent className="flex flex-col p-6">
				<div className="text-sm font-medium text-muted-foreground">{title}</div>
				<div className="text-3xl font-bold mt-2">{value.toLocaleString()}</div>
				{growth !== undefined && (
					<div className="flex items-center mt-1">
						{growth > 0 ? (
							<ArrowUp className="h-4 w-4 text-green-500 mr-1" />
						) : growth < 0 ? (
							<ArrowDown className="h-4 w-4 text-red-500 mr-1" />
						) : null}
						<span
							className={
								growth > 0 ? "text-green-500" : growth < 0 ? "text-red-500" : "text-muted-foreground"
							}
						>
							{Math.abs(growth)}%
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export function KPICards() {
	const { data: kpis, isLoading, error } = useDashboardKPIs();

	if (isLoading) return <KPICardsSkeleton />;
	if (error || !kpis) return <div>Error loading KPI data</div>;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<KPICard title="Full-Time Developers" value={kpis.fullTimeDevs} growth={kpis.fullTimeDevsGrowth} />
			<KPICard title="Monthly Active Devs" value={kpis.monthlyActiveDevs} growth={kpis.monthlyActiveDevsGrowth} />
			<KPICard title="Total Repositories" value={kpis.totalRepos} growth={kpis.totalReposGrowth} />
			<KPICard title="Total Commits" value={kpis.totalCommits} growth={kpis.totalCommitsGrowth} />
		</div>
	);
}

export function KPICardsSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{[...Array(4)].map((_, i) => (
				<Card key={i}>
					<CardContent className="flex flex-col p-6">
						<div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
						<div className="h-8 w-16 bg-muted rounded mt-2 animate-pulse"></div>
						<div className="h-4 w-12 bg-muted rounded mt-1 animate-pulse"></div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
