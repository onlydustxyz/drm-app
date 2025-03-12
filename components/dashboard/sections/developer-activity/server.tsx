import { getDeveloperActivity } from "@/lib/services/dashboard-service";
import { ServerChartSection } from "../chart-base/server-chart-section";

export async function ServerDeveloperActivitySection() {
	// Fetch data on the server
	const data = await getDeveloperActivity();

	return (
		<ServerChartSection
			title="Developer Activity"
			description="Monthly developer activity by type"
			data={data}
			chartType="DevTypeDistribution"
		/>
	);
}
