"use client";

import { ClientChartSection } from "./chart-base/client-chart-section";
import { useMonthlyCommits } from "@/lib/react-query/dashboard";

export function MonthlyCommitsSection() {
	const { data, isLoading, error } = useMonthlyCommits();

	if (isLoading) return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
	if (error || !data) return <div>Error loading monthly commits data</div>;

	return (
		<ClientChartSection
			title="Monthly Commits"
			description="Commit volume trends over time"
			data={data}
			chartType="MonthlyCommits"
		/>
	);
}
