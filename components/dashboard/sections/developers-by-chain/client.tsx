"use client";

import { DevelopersByChainChart } from "@/components/charts/dashboard-charts";
import { DevelopersByChain, getDevelopersByChain } from "@/lib/services/dashboard-service";
import { filterDataBySource } from "../../dashboard-context";
import { BaseChartSection } from "../chart-base/base-chart-section";

export function DevelopersByChainSection() {
	return (
		<BaseChartSection<DevelopersByChain>
			title="Developers by Chain"
			description="Historical view of single vs multi-chain developers"
			fetchData={getDevelopersByChain}
			filterData={filterDataBySource}
			renderChart={(data) => <DevelopersByChainChart data={data} />}
		/>
	);
}
