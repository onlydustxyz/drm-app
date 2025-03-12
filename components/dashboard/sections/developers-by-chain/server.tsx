import { getDevelopersByChain } from "@/lib/services/dashboard-service";
import { ServerChartSection } from "../chart-base/server-chart-section";

export async function ServerDevelopersByChainSection() {
	// Fetch data on the server
	const data = await getDevelopersByChain();

	return (
		<ServerChartSection
			title="Developers by Chain"
			description="Historical view of single vs multi-chain developers"
			data={data}
			chartType="DevelopersByChain"
		/>
	);
}
