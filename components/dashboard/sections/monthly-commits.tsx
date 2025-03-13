import { getMonthlyCommits } from "@/lib/services/dashboard-service";
import { ServerChartSection } from "./chart-base/server-chart-section";

export async function ServerMonthlyCommitsSection() {
	// Fetch data on the server
	const data = await getMonthlyCommits();

	return (
		<ServerChartSection
			title="Monthly Commits"
			description="Commit volume trends over time"
			data={data}
			chartType="MonthlyCommits"
		/>
	);
}
