import { getDeveloperLocations } from "@/lib/services/dashboard-service";
import { ServerChartSection } from "./chart-base/server-chart-section";

export async function ServerDeveloperLocationsSection() {
	// Fetch data on the server
	const data = await getDeveloperLocations();

	return (
		<ServerChartSection
			title="Developer Locations"
			description="Geographical distribution of developers"
			data={data}
			chartType="DeveloperLocations"
		/>
	);
}
