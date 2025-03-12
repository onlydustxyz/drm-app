"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode, useEffect, useState } from "react";
import { useDashboardContext } from "../../dashboard-context";

interface BaseChartSectionProps<T> {
	title: string;
	description?: string;
	fetchData: () => Promise<T[]>;
	filterData?: (data: T[], sourceId: string) => T[];
	renderChart: (data: T[]) => ReactNode;
}

export function BaseChartSection<T>({
	title,
	description,
	fetchData,
	filterData = (data) => data,
	renderChart,
}: BaseChartSectionProps<T>) {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const { sourceId } = useDashboardContext();

	useEffect(() => {
		async function loadData() {
			setLoading(true);
			try {
				const fetchedData = await fetchData();
				const filteredData = filterData(fetchedData, sourceId);
				setData(filteredData);
			} catch (error) {
				console.error(`Error fetching data for ${title}:`, error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, [fetchData, filterData, sourceId, title]);

	return (
		<Card className="col-span-1">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="h-80">
				{loading ? (
					<div className="flex items-center justify-center h-full">
						<p>Loading chart data...</p>
					</div>
				) : (
					renderChart(data)
				)}
			</CardContent>
		</Card>
	);
}
