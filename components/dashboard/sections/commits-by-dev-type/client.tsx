"use client";

import { CommitsByDevTypeChart } from "@/components/charts/dashboard-charts";
import { CommitsByDevType, getCommitsByDevType } from "@/lib/services/dashboard-service";
import { filterDataBySource } from "../../dashboard-context";
import { BaseChartSection } from "../chart-base/base-chart-section";

export function CommitsByDevTypeSection() {
	return (
		<BaseChartSection<CommitsByDevType>
			title="Commits by Developer Type"
			description="Contribution volume by different developer types"
			fetchData={getCommitsByDevType}
			filterData={filterDataBySource}
			renderChart={(data) => <CommitsByDevTypeChart data={data} />}
		/>
	);
}
