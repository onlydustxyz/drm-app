"use client";

import { DevTypeDistributionChart } from "@/components/charts/dashboard-charts";
import { DeveloperActivity, getDeveloperActivity } from "@/lib/services/dashboard-service";
import { filterDataBySource } from "../../dashboard-context";
import { BaseChartSection } from "../chart-base/base-chart-section";

export function DeveloperActivitySection() {
	return (
		<BaseChartSection<DeveloperActivity>
			title="Developer Activity"
			description="Monthly developer activity by type"
			fetchData={getDeveloperActivity}
			filterData={filterDataBySource}
			renderChart={(data) => <DevTypeDistributionChart data={data} />}
		/>
	);
}
