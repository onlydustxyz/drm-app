"use client";

import { ClientChartSection } from "./chart-base/client-chart-section";
import { useDevActivity } from "@/lib/react-query/dashboard";

export function DevActivitySection() {
	const { data, isLoading, error } = useDevActivity();

	if (isLoading) return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
	if (error || !data) return <div>Error loading dev activity data</div>;

	return (
		<ClientChartSection
			title="Developer Activity Trends"
			description="Active, churned and reactivated developers over time"
			data={data}
			chartType="DevActivity"
		/>
	);
}
