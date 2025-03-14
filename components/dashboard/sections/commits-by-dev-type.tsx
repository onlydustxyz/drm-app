"use client";

import { ClientChartSection } from "./chart-base/client-chart-section";
import { useCommitsByDevType } from "@/lib/react-query/dashboard";

export function CommitsByDevTypeSection() {
	const { data, isLoading, error } = useCommitsByDevType();

	if (isLoading) return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
	if (error || !data) return <div>Error loading commits by dev type data</div>;

	return (
		<ClientChartSection
			title="Commits by Developer Type"
			description="Contribution volume by different developer types"
			data={data}
			chartType="CommitsByDevType"
		/>
	);
}
