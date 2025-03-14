"use client";

import { ClientChartSection } from "./chart-base/client-chart-section";
import { useDevelopersByCountry } from "@/lib/react-query/dashboard";

export function ContributorsByCountrySection() {
	const { data, isLoading, error } = useDevelopersByCountry();

	if (isLoading) return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
	if (error || !data) return <div>Error loading contributors by country data</div>;

	return (
		<ClientChartSection
			title="Contributors by Country"
			description="Top countries by contributor count"
			data={data}
			chartType="ContributorsByCountry"
		/>
	);
} 