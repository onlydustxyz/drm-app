"use client";

import { DeveloperLocationsMap } from "@/components/charts/dashboard-charts";
import { DeveloperLocation, getDeveloperLocations } from "@/lib/services/dashboard-service";
import { filterDataBySource } from "../../dashboard-context";
import { BaseChartSection } from "../chart-base/base-chart-section";

export function DeveloperLocationsSection() {
	return (
		<BaseChartSection<DeveloperLocation>
			title="Developer Locations"
			description="Geographical distribution of developers"
			fetchData={getDeveloperLocations}
			filterData={filterDataBySource}
			renderChart={(data) => <DeveloperLocationsMap data={data} />}
		/>
	);
}
