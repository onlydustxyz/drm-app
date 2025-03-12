"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import { DashboardProvider, useDashboardContext } from "./dashboard-context";
import { DataSourceSelector, dataSources } from "./data-source-selector";

interface DashboardLayoutProps {
	children: ReactNode;
}

function DashboardHeader() {
	const { sourceId, setSourceId } = useDashboardContext();
	const selectedSource = dataSources.find((source) => source.id === sourceId);

	// Mock contributor counts for each list
	const contributorCounts: { [key: string]: number } = {
		all: 1250,
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
		"nft-projects": 220,
	};

	// Mock project counts for each list
	const projectCounts: { [key: string]: number } = {
		all: 87,
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
		"nft-projects": 20,
	};

	const handleSourceChange = (newSourceId: string) => {
		setSourceId(newSourceId);
	};

	// Determine what count to show based on the selected source type
	const getCountBadge = () => {
		if (!selectedSource) return null;

		if (selectedSource.type === "project-list") {
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
		<>
			<div className="flex justify-between items-center">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
						{getCountBadge()}
					</div>
					<p className="text-muted-foreground">
						Metrics for your developer ecosystem, filtered by{" "}
						{selectedSource?.type === "project-list" ? "project" : "contributor"} lists.
						{selectedSource?.description && (
							<span className="ml-1 text-sm italic">({selectedSource.description})</span>
						)}
					</p>
				</div>
				<DataSourceSelector onSourceChange={handleSourceChange} />
			</div>
			<Separator />
		</>
	);
}

function DashboardContent({ children }: { children: ReactNode }) {
	return (
		<div className="space-y-6 w-full max-w-full">
			<DashboardHeader />
			<div className="space-y-6 w-full max-w-full">{children}</div>
		</div>
	);
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<DashboardProvider>
			<DashboardContent>{children}</DashboardContent>
		</DashboardProvider>
	);
}
