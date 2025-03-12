"use client";

import { MonthlyCommitsChart } from "@/components/charts/dashboard-charts";
import { MonthlyCommits, getMonthlyCommits } from "@/lib/services/dashboard-service";
import { filterDataBySource } from "../../dashboard-context";
import { BaseChartSection } from "../chart-base/base-chart-section";

export function MonthlyCommitsSection() {
	return (
		<BaseChartSection<MonthlyCommits>
			title="Monthly Commits"
			description="Commit volume trends over time"
			fetchData={getMonthlyCommits}
			filterData={filterDataBySource}
			renderChart={(data) => <MonthlyCommitsChart data={data} />}
		/>
	);
}
