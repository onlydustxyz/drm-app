"use client";

import { Chart } from "./chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientChartSectionProps {
	title: string;
	description: string;
	data: any[];
	chartType: string;
}

export function ClientChartSection({ title, description, data, chartType }: ClientChartSectionProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-80">
					<Chart data={data} chartType={chartType} />
				</div>
			</CardContent>
		</Card>
	);
} 