import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "./chart";

interface ServerChartSectionProps {
	title: string;
	description?: string;
	data: any[];
	chartType: string;
}

// This is a server component
export async function ServerChartSection({ title, description, data, chartType }: ServerChartSectionProps) {
	return (
		<Card className="col-span-1">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="h-80">
				<Chart data={data} chartType={chartType} />
			</CardContent>
		</Card>
	);
}
