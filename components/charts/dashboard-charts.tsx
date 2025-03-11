"use client";

import { DeveloperActivity } from "@/lib/dashboard-service";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

// Sample data for charts
export const revenueData = [
	{ name: "Jan", value: 12000 },
	{ name: "Feb", value: 15000 },
	{ name: "Mar", value: 18000 },
	{ name: "Apr", value: 16000 },
	{ name: "May", value: 21000 },
	{ name: "Jun", value: 19000 },
	{ name: "Jul", value: 25000 },
	{ name: "Aug", value: 22000 },
	{ name: "Sep", value: 28000 },
	{ name: "Oct", value: 32000 },
	{ name: "Nov", value: 38000 },
	{ name: "Dec", value: 45231 },
];

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function RevenueChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				data={revenueData}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
			</AreaChart>
		</ResponsiveContainer>
	);
}

interface ActiveDevsChartProps {
	data: DeveloperActivity[];
}

export function ActiveDevsChart({ data }: ActiveDevsChartProps) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				data={data}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Area 
					type="monotone" 
					dataKey="fullTime" 
					name="Full Time Devs"
					stackId="1"
					stroke="#22c55e" 
					fill="#22c55e" 
					fillOpacity={0.3} 
				/>
				<Area 
					type="monotone" 
					dataKey="partTime" 
					name="Part Time Devs"
					stackId="1"
					stroke="#3b82f6" 
					fill="#3b82f6" 
					fillOpacity={0.3} 
				/>
				<Area 
					type="monotone" 
					dataKey="onTime" 
					name="On-Time Devs"
					stackId="1"
					stroke="#f59e0b" 
					fill="#f59e0b" 
					fillOpacity={0.3} 
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
