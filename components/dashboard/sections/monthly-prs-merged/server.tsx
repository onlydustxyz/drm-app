import { getMonthlyPRsMerged } from "@/lib/services/dashboard-service";
import { ServerChartSection } from "../chart-base/server-chart-section";

export async function ServerMonthlyPRsMergedSection() {
	// Fetch data on the server
	const data = await getMonthlyPRsMerged();

	return (
		<ServerChartSection
			title="Monthly PRs Merged"
			description="Pull request completion trends over time"
			data={data}
			chartType="MonthlyPRsMerged"
		/>
	);
}
