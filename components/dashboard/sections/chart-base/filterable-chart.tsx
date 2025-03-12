"use client";

import {
	CommitsByDevTypeChart,
	DevActivityChart,
	DevTypeDistributionChart,
	DeveloperLocationsMap,
	DevelopersByChainChart,
	MonthlyCommitsChart,
	MonthlyPRsMergedChart,
} from "@/components/charts/dashboard-charts";
import {
	CommitsByDevType,
	DevActivity,
	DeveloperActivity,
	DeveloperLocation,
	DevelopersByChain,
	MonthlyCommits,
	MonthlyPRsMerged,
} from "@/lib/services/dashboard-service";
import { filterDataBySource, useDashboardContext } from "../../dashboard-context";

interface FilterableChartProps {
	data: any[];
	chartType: string;
}

export function FilterableChart({ data, chartType }: FilterableChartProps) {
	const { sourceId } = useDashboardContext();

	// Filter the data based on the source ID
	const filteredData = Array.isArray(data) ? filterDataBySource(data, sourceId) : data;

	// Render the appropriate chart based on the chartType
	switch (chartType) {
		case "DevTypeDistribution":
			return <DevTypeDistributionChart data={filteredData as DeveloperActivity[]} />;
		case "DevelopersByChain":
			return <DevelopersByChainChart data={filteredData as DevelopersByChain[]} />;
		case "DeveloperLocations":
			return <DeveloperLocationsMap data={filteredData as DeveloperLocation[]} />;
		case "CommitsByDevType":
			return <CommitsByDevTypeChart data={filteredData as CommitsByDevType[]} />;
		case "MonthlyCommits":
			return <MonthlyCommitsChart data={filteredData as MonthlyCommits[]} />;
		case "MonthlyPRsMerged":
			return <MonthlyPRsMergedChart data={filteredData as MonthlyPRsMerged[]} />;
		case "DevActivity":
			return <DevActivityChart data={filteredData as DevActivity[]} />;
		default:
			return <div>Chart type not recognized</div>;
	}
}
