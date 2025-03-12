"use client";

import { MonthlyPRsMergedChart } from "@/components/charts/dashboard-charts";
import { MonthlyPRsMerged, getMonthlyPRsMerged } from "@/lib/services/dashboard-service";
import { filterDataBySource } from "../../dashboard-context";
import { BaseChartSection } from "../chart-base/base-chart-section";

export function MonthlyPRsMergedSection() {
	return (
		<BaseChartSection<MonthlyPRsMerged>
			title="Monthly PRs Merged"
			description="Pull request completion trends over time"
			fetchData={getMonthlyPRsMerged}
			filterData={filterDataBySource}
			renderChart={(data) => <MonthlyPRsMergedChart data={data} />}
		/>
	);
}
