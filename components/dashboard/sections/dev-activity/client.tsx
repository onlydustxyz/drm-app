"use client";

import { DevActivityChart } from "@/components/charts/dashboard-charts";
import { DevActivity, getDevActivity } from "@/lib/services/dashboard-service";
import { filterDataBySource } from "../../dashboard-context";
import { BaseChartSection } from "../chart-base/base-chart-section";

export function DevActivitySection() {
	return (
		<BaseChartSection<DevActivity>
			title="Developer Activity Trends"
			description="Active, churned and reactivated developers over time"
			fetchData={getDevActivity}
			filterData={filterDataBySource}
			renderChart={(data) => <DevActivityChart data={data} />}
		/>
	);
}
