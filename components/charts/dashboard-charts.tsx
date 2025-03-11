"use client";

import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
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

export const dealStageData = [
	{ name: "Discovery", value: 35 },
	{ name: "Qualified", value: 25 },
	{ name: "Proposal", value: 20 },
	{ name: "Negotiation", value: 12 },
	{ name: "Closed Won", value: 8 },
];

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const contactGrowthData = [
	{ name: "Jan", new: 25, lost: 5 },
	{ name: "Feb", new: 30, lost: 8 },
	{ name: "Mar", new: 35, lost: 10 },
	{ name: "Apr", new: 40, lost: 12 },
	{ name: "May", new: 42, lost: 15 },
	{ name: "Jun", new: 48, lost: 10 },
	{ name: "Jul", new: 52, lost: 8 },
	{ name: "Aug", new: 55, lost: 12 },
	{ name: "Sep", new: 60, lost: 15 },
	{ name: "Oct", new: 65, lost: 18 },
	{ name: "Nov", new: 68, lost: 15 },
	{ name: "Dec", new: 72, lost: 10 },
];

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

export function DealStageChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart>
				<Pie
					data={dealStageData}
					cx="50%"
					cy="50%"
					labelLine={false}
					label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
					outerRadius={80}
					fill="#8884d8"
					dataKey="value"
				>
					{dealStageData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}

export function ContactGrowthChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				data={contactGrowthData}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="new" fill="#8884d8" name="New Contacts" />
				<Bar dataKey="lost" fill="#82ca9d" name="Lost Contacts" />
			</BarChart>
		</ResponsiveContainer>
	);
}
