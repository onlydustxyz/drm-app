"use client";

import { ClientChartSection } from "./chart-base/client-chart-section";
import { useDeveloperActivity } from "@/lib/react-query/dashboard";

export function DeveloperActivitySection() {
	const { data, isLoading, error } = useDeveloperActivity();

	if (isLoading) return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
	if (error || !data) return <div>Error loading developer activity data</div>;

	return (
		<ClientChartSection
			title="Developer Activity"
			description="Monthly developer activity by type"
			data={data}
			chartType="DevTypeDistribution"
		/>
	);
}
