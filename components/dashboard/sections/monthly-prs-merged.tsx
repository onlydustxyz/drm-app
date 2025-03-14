"use client";

import { ClientChartSection } from "./chart-base/client-chart-section";
import { useMonthlyPRsMerged } from "@/lib/react-query/dashboard";

export function MonthlyPRsMergedSection() {
	const { data, isLoading, error } = useMonthlyPRsMerged();

	if (isLoading) return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
	if (error || !data) return <div>Error loading monthly PRs merged data</div>;

	return (
		<ClientChartSection
			title="Monthly PRs Merged"
			description="Number of PRs merged per month"
			data={data}
			chartType="MonthlyPRsMerged"
		/>
	);
}
