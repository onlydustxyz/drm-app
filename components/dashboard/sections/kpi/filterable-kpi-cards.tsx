"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardKPI } from "@/lib/services/dashboard-service";
import { Code, FolderGit2, Users } from "lucide-react";
import { useMemo } from "react";
import { useDashboardContext } from "../../dashboard-context";

interface FilterableKPICardsProps {
	kpis: DashboardKPI;
}

export function FilterableKPICards({ kpis: initialKpis }: FilterableKPICardsProps) {
	const { sourceId } = useDashboardContext();

	// Apply scaling based on sourceId if needed
	const kpis = useMemo(() => {
		if (sourceId === "all") {
			return initialKpis;
		}

		// Apply scaling factor based on the sourceId
		const scalingFactors: { [key: string]: number } = {
			// Contributor lists
			"active-contributors": 0.85,
			"full-time-devs": 0.45,
			"top-contributors": 0.25,
			"new-contributors": 0.15,
			"project-leads": 0.08,
			"community-contributors": 0.75,
			"backend-devs": 0.35,
			"frontend-devs": 0.4,
			"contract-devs": 0.2,

			// Project lists
			"active-projects": 0.7,
			"high-activity-projects": 0.4,
			"new-projects": 0.2,
			"ethereum-projects": 0.45,
			"solana-projects": 0.25,
			"polkadot-projects": 0.15,
			"near-projects": 0.1,
			"cosmos-projects": 0.12,
			"defi-projects": 0.3,
			"nft-projects": 0.18,
		};

		const factor = scalingFactors[sourceId] || 1;

		return {
			...initialKpis,
			fullTimeDevs: Math.round(initialKpis.fullTimeDevs * factor),
			monthlyActiveDevs: Math.round(initialKpis.monthlyActiveDevs * factor),
			totalProjects: Math.round(initialKpis.totalProjects * factor),
			totalCommits: Math.round(initialKpis.totalCommits * factor),
		};
	}, [initialKpis, sourceId]);

	return (
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
	);
}
