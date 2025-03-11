"use client";

import { DeveloperActivity, DevelopersByChain } from "@/lib/dashboard-service";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
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

export function ActiveDevsChart({ data }: { data: DeveloperActivity[] }) {
	const formattedData = data.map(item => {
		return {
			name: item.month,
			value: item.activeDevs
		};
	});

	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				data={formattedData}
				margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis dataKey="name" />
				<YAxis />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="value"
					stroke="#8884d8"
					fillOpacity={1}
					fill="url(#colorUv)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}

interface DevelopersByChainChartProps {
	data: DevelopersByChain[];
}

export function DevelopersByChainChart({ data }: DevelopersByChainChartProps) {
	// Format the date for display
	const formattedData = data.map(item => {
		const [year, month] = item.date.split('-');
		return {
			...item,
			formattedDate: `${year}-${month}`
		};
	});

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				data={formattedData}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis 
					dataKey="formattedDate" 
					tick={{ fontSize: 10 }}
					interval={6} // Show every 6th label to avoid crowding
				/>
				<YAxis 
					domain={[0, 'dataMax + 50']} 
					label={{ value: 'Developers', angle: -90, position: 'insideLeft' }} 
				/>
				<Tooltip 
					formatter={(value, name) => {
						return [value, name === "singleChain" ? "Single Chain" : "Multi Chain"];
					}}
					labelFormatter={(label) => `Date: ${label}`}
				/>
				<Legend 
					formatter={(value) => value === "singleChain" ? "Single Chain" : "Multi Chain"}
				/>
				<Line 
					type="monotone" 
					dataKey="singleChain" 
					name="singleChain"
					stroke="#3b82f6" 
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
				<Line 
					type="monotone" 
					dataKey="multiChain" 
					name="multiChain"
					stroke="#22c55e" 
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
