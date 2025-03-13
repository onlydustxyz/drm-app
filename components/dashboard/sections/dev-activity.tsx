import { getDevActivity } from "@/lib/services/dashboard-service";
import { ServerChartSection } from "./chart-base/server-chart-section";

export async function ServerDevActivitySection() {
	// Fetch data on the server
	const data = await getDevActivity();

	return (
		<ServerChartSection
			title="Developer Activity Trends"
			description="Active, churned and reactivated developers over time"
			data={data}
			chartType="DevActivity"
		/>
	);
}
