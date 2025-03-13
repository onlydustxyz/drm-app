import {
	CommitsByDevTypeChart,
	DevActivityChart,
	DevTypeDistributionChart,
	DeveloperLocationsMap,
	MonthlyCommitsChart,
	MonthlyPRsMergedChart,
} from "@/components/charts/dashboard-charts";
import {
	CommitsByDevType,
	DevActivity,
	DeveloperActivity,
	DeveloperLocation,
	MonthlyCommits,
	MonthlyPRsMerged,
} from "@/lib/services/dashboard-service";

interface ChartProps {
	data: any[];
	chartType: string;
}

export function Chart({ data, chartType }: ChartProps) {
	// Render the appropriate chart based on the chartType
	switch (chartType) {
		case "DevTypeDistribution":
			return <DevTypeDistributionChart data={data as DeveloperActivity[]} />;
		case "DeveloperLocations":
			return <DeveloperLocationsMap data={data as DeveloperLocation[]} />;
		case "CommitsByDevType":
			return <CommitsByDevTypeChart data={data as CommitsByDevType[]} />;
		case "MonthlyCommits":
			return <MonthlyCommitsChart data={data as MonthlyCommits[]} />;
		case "MonthlyPRsMerged":
			return <MonthlyPRsMergedChart data={data as MonthlyPRsMerged[]} />;
		case "DevActivity":
			return <DevActivityChart data={data as DevActivity[]} />;
		default:
			return <div>Chart type not recognized</div>;
	}
}
