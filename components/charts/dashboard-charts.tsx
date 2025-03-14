"use client";

import {
	CommitsByDevType,
	DevActivity,
	DeveloperActivity,
	DeveloperLocation,
	MonthlyCommits,
	MonthlyPRsMerged,
} from "@/lib/services/dashboard-service";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ComposedChart,
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

// Developer Type Distribution Line Chart (replacing the pie chart)
export function DevTypeDistributionChart({ data }: { data: DeveloperActivity[] }) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
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
				<Line
					type="monotone"
					dataKey="fullTime"
					name="Full Time Devs"
					stroke="#22c55e"
					strokeWidth={2}
					dot={{ r: 3 }}
					activeDot={{ r: 6 }}
				/>
				<Line
					type="monotone"
					dataKey="partTime"
					name="Part Time Devs"
					stroke="#3b82f6"
					strokeWidth={2}
					dot={{ r: 3 }}
					activeDot={{ r: 6 }}
				/>
				<Line
					type="monotone"
					dataKey="onTime"
					name="One Time Devs"
					stroke="#f59e0b"
					strokeWidth={2}
					dot={{ r: 3 }}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}

// Commits by Developer Type Chart
export function CommitsByDevTypeChart({ data }: { data: CommitsByDevType[] }) {
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
					name="One Time Devs"
					stackId="1"
					stroke="#f59e0b"
					fill="#f59e0b"
					fillOpacity={0.3}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}

// Monthly Commits Chart
export function MonthlyCommitsChart({ data }: { data: MonthlyCommits[] }) {
	// Format the date for display
	const formattedData = data.map((item) => {
		const [year, month] = item.date.split("-");
		return {
			...item,
			formattedDate: `${year}-${month}`,
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
				<XAxis dataKey="formattedDate" tick={{ fontSize: 10 }} interval={1} />
				<YAxis />
				<Tooltip
					formatter={(value) => [`${value} commits`, "Commits"]}
					labelFormatter={(label) => `Date: ${label}`}
				/>
				<Legend />
				<Line
					type="monotone"
					dataKey="count"
					name="Commits"
					stroke="#3b82f6"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}

// Monthly PRs Merged Chart
export function MonthlyPRsMergedChart({ data }: { data: MonthlyPRsMerged[] }) {
	// Format the date for display
	const formattedData = data.map((item) => {
		const [year, month] = item.date.split("-");
		return {
			...item,
			formattedDate: `${year}-${month}`,
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
				<XAxis dataKey="formattedDate" tick={{ fontSize: 10 }} interval={1} />
				<YAxis />
				<Tooltip
					formatter={(value) => [`${value} PRs`, "PRs Merged"]}
					labelFormatter={(label) => `Date: ${label}`}
				/>
				<Legend />
				<Line
					type="monotone"
					dataKey="count"
					name="PRs Merged"
					stroke="#22c55e"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}

// Developer Activity Chart (Active/Churned/Reactivated)
export function DevActivityChart({ data }: { data: DevActivity[] }) {
	// Format the date for display
	const formattedData = data.map((item) => {
		const [year, month] = item.date.split("-");
		return {
			...item,
			formattedDate: `${year}-${month}`,
		};
	});

	return (
		<ResponsiveContainer width="100%" height="100%">
			<ComposedChart
				data={formattedData}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="formattedDate" tick={{ fontSize: 10 }} interval={1} />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="active" name="Active Devs" fill="#22c55e" />
				<Bar dataKey="churned" name="Churned Devs" fill="#ef4444" />
				<Line type="monotone" dataKey="reactivated" name="Reactivated Devs" stroke="#f59e0b" strokeWidth={2} />
			</ComposedChart>
		</ResponsiveContainer>
	);
}

// Contributors By Country Chart
export function ContributorsByCountryChart({ data }: { data: DeveloperLocation[] }) {
	// Sort data by count in descending order and take top 10 countries
	const sortedData = [...data]
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				data={sortedData}
				margin={{
					top: 10,
					right: 30,
					left: 60,
					bottom: 60,
				}}
				layout="vertical"
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis type="number" />
				<YAxis 
					type="category" 
					dataKey="country"
					tick={{ fontSize: 12 }}
					width={100}
				/>
				<Tooltip
					formatter={(value) => [`${value} contributors`, "Contributors"]}
					labelFormatter={(label) => `Country: ${label}`}
				/>
				<Legend />
				<Bar 
					dataKey="count" 
					name="Contributors" 
					fill="#3b82f6" 
					barSize={20}
					radius={[0, 4, 4, 0]}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}
