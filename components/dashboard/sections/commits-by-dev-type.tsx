import { getCommitsByDevType } from "@/lib/services/dashboard-service";
import { ServerChartSection } from "./chart-base/server-chart-section";

export async function ServerCommitsByDevTypeSection() {
	// Fetch data on the server
	const data = await getCommitsByDevType();

	return (
		<ServerChartSection
			title="Commits by Developer Type"
			description="Contribution volume by different developer types"
			data={data}
			chartType="CommitsByDevType"
		/>
	);
}
