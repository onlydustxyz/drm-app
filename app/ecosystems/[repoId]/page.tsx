import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Calendar, Eye, GitBranch, GitFork, Star } from "lucide-react";
import Link from "next/link";

// Mock data for commit frequency (weekly commits over 8 weeks)
const contributionFrequency = [42, 56, 38, 27, 53, 45, 62, 38];

// Mock data for commit trends over time (monthly commits over 6 months)
const commitTrends = [
	{ month: "Oct", count: 127 },
	{ month: "Nov", count: 142 },
	{ month: "Dec", count: 105 },
	{ month: "Jan", count: 168 },
	{ month: "Feb", count: 152 },
	{ month: "Mar", count: 183 },
];

// Mock data for forks and their engagement
const forksEngagement = [{ totalForks: 328, activeForks: 167, inactiveForks: 161 }];

// Mock data for fork contributors
const forks = [
	{
		id: 1,
		name: "user1/blockchain-core",
		url: "https://github.com/user1/blockchain-core",
		lastActivity: "2024-03-12",
		contributors: [
			{ id: 1, name: "user1", avatar: "https://github.com/user1.png", commits: 42 },
			{ id: 2, name: "contributor2", avatar: "https://github.com/contributor2.png", commits: 17 },
			{ id: 3, name: "contributor3", avatar: "https://github.com/contributor3.png", commits: 9 },
		],
	},
	{
		id: 2,
		name: "organization-xyz/blockchain-core",
		url: "https://github.com/organization-xyz/blockchain-core",
		lastActivity: "2024-03-10",
		contributors: [
			{ id: 4, name: "maintainer1", avatar: "https://github.com/maintainer1.png", commits: 67 },
			{ id: 5, name: "developer2", avatar: "https://github.com/developer2.png", commits: 38 },
			{ id: 6, name: "developer3", avatar: "https://github.com/developer3.png", commits: 23 },
		],
	},
	{
		id: 3,
		name: "techteam/blockchain-core",
		url: "https://github.com/techteam/blockchain-core",
		lastActivity: "2024-03-05",
		contributors: [
			{ id: 7, name: "lead-dev", avatar: "https://github.com/lead-dev.png", commits: 51 },
			{ id: 8, name: "coder42", avatar: "https://github.com/coder42.png", commits: 29 },
		],
	},
];

// Mock data for repositories
const repositories = [
	{
		id: 1,
		name: "blockchain-core",
		description: "Core blockchain implementation for the ecosystem",
		url: "https://github.com/ecosystem/blockchain-core",
		owner: "ecosystem",
		stars: 1245,
		forks: 328,
		watchers: 89,
		lastUpdated: "2023-12-15",
		primaryLanguage: "Rust",
		license: "MIT",
	},
	{
		id: 2,
		name: "smart-contracts",
		description: "Smart contract templates and libraries",
		url: "https://github.com/ecosystem/smart-contracts",
		owner: "ecosystem",
		stars: 876,
		forks: 203,
		watchers: 55,
		lastUpdated: "2024-01-20",
		primaryLanguage: "Solidity",
		license: "Apache-2.0",
	},
	{
		id: 3,
		name: "ecosystem-js",
		description: "JavaScript SDK for ecosystem integration",
		url: "https://github.com/ecosystem/ecosystem-js",
		owner: "ecosystem",
		stars: 543,
		forks: 127,
		watchers: 34,
		lastUpdated: "2024-02-10",
		primaryLanguage: "TypeScript",
		license: "MIT",
	},
	{
		id: 4,
		name: "docs",
		description: "Documentation for the ecosystem",
		url: "https://github.com/ecosystem/docs",
		owner: "ecosystem",
		stars: 320,
		forks: 98,
		watchers: 28,
		lastUpdated: "2024-03-01",
		primaryLanguage: "MDX",
		license: "CC-BY-4.0",
	},
	{
		id: 5,
		name: "governance",
		description: "Governance tools and proposals",
		url: "https://github.com/ecosystem/governance",
		owner: "ecosystem",
		stars: 412,
		forks: 87,
		watchers: 42,
		lastUpdated: "2024-02-25",
		primaryLanguage: "Python",
		license: "GPL-3.0",
	},
];

export default function RepositoryOverviewPage({ params }: { params: { repoId: string } }) {
	const repoId = parseInt(params.repoId);
	const repository = repositories.find((repo) => repo.id === repoId);

	if (!repository) {
		return <div className="text-center p-12">Repository not found</div>;
	}

	// Helper function to render a simple bar chart
	const renderBarChart = (data: number[], maxHeight: number = 100) => {
		const max = Math.max(...data);
		return (
			<div className="flex items-end h-[100px] gap-1 mt-4">
				{data.map((value, index) => (
					<div
						key={index}
						className="bg-primary w-8 rounded-t-sm"
						style={{ height: `${(value / max) * maxHeight}px` }}
						title={`${value} commits`}
					></div>
				))}
			</div>
		);
	};

	// Helper function to render a line chart
	const renderLineChart = (data: { month: string; count: number }[], height: number = 100) => {
		const max = Math.max(...data.map((d) => d.count));
		const width = 300;
		const pointWidth = width / (data.length - 1);

		const points = data.map((point, index) => {
			const x = index * pointWidth;
			const y = height - (point.count / max) * height;
			return { x, y, ...point };
		});

		const pathD = points.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

		return (
			<div className="mt-4 h-[120px]">
				<svg width={width} height={height} className="overflow-visible">
					<path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
					{points.map((point, i) => (
						<g key={i}>
							<circle cx={point.x} cy={point.y} r="4" fill="hsl(var(--primary))" />
							<text x={point.x} y={height + 20} fontSize="12" textAnchor="middle" fill="currentColor">
								{point.month}
							</text>
						</g>
					))}
				</svg>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<div className="flex items-center gap-2">
						<Link href="/ecosystems">
							<Button variant="outline" size="sm">
								Back to repositories
							</Button>
						</Link>
						<h1 className="text-3xl font-bold tracking-tight">{repository.name}</h1>
					</div>
					<p className="text-muted-foreground">{repository.description}</p>
				</div>
				<div className="flex gap-4">
					<div className="flex items-center gap-1">
						<Star className="h-5 w-5 text-yellow-500" />
						<span className="font-medium">{repository.stars}</span>
					</div>
					<div className="flex items-center gap-1">
						<GitFork className="h-5 w-5 text-gray-500" />
						<span className="font-medium">{repository.forks}</span>
					</div>
					<div className="flex items-center gap-1">
						<Eye className="h-5 w-5 text-blue-500" />
						<span className="font-medium">{repository.watchers}</span>
					</div>
				</div>
			</div>

			<Separator />

			{/* Metrics Cards */}
			<div className="grid grid-cols-3 gap-4">
				{/* Contribution Frequency Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Contribution Frequency
						</CardTitle>
						<CardDescription>Weekly commits over the last 8 weeks</CardDescription>
					</CardHeader>
					<CardContent>
						{renderBarChart(contributionFrequency)}
						<div className="flex justify-between mt-2 text-xs text-muted-foreground">
							<span>8 weeks ago</span>
							<span>This week</span>
						</div>
					</CardContent>
				</Card>

				{/* Commit Trends Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Commit Trends
						</CardTitle>
						<CardDescription>Monthly commits over the last 6 months</CardDescription>
					</CardHeader>
					<CardContent>{renderLineChart(commitTrends)}</CardContent>
				</Card>

				{/* Forks Engagement Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<GitBranch className="h-5 w-5" />
							Forks Engagement
						</CardTitle>
						<CardDescription>Activity distribution across forks</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="mt-4 space-y-4">
							<div className="flex items-center justify-between">
								<span>Total Forks</span>
								<span className="font-bold">{forksEngagement[0].totalForks}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Active Forks</span>
								<span className="font-bold text-green-600">{forksEngagement[0].activeForks}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Inactive Forks</span>
								<span className="font-bold text-red-600">{forksEngagement[0].inactiveForks}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
								<div
									className="bg-green-600 h-2.5 rounded-full"
									style={{
										width: `${
											(forksEngagement[0].activeForks / forksEngagement[0].totalForks) * 100
										}%`,
									}}
								></div>
							</div>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>
									Active:{" "}
									{Math.round((forksEngagement[0].activeForks / forksEngagement[0].totalForks) * 100)}
									%
								</span>
								<span>
									Inactive:{" "}
									{Math.round(
										(forksEngagement[0].inactiveForks / forksEngagement[0].totalForks) * 100
									)}
									%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Forks List */}
			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">Repository Forks</h2>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Fork</TableHead>
								<TableHead>Last Activity</TableHead>
								<TableHead>Contributors</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{forks.map((fork) => (
								<TableRow key={fork.id}>
									<TableCell className="font-medium">
										<a
											href={fork.url}
											className="hover:underline text-primary"
											target="_blank"
											rel="noopener noreferrer"
										>
											{fork.name}
										</a>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">{fork.lastActivity}</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex -space-x-2">
											{fork.contributors.map((contributor) => (
												<div
													key={contributor.id}
													className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
													title={`${contributor.name} (${contributor.commits} commits)`}
												>
													<img
														src={contributor.avatar}
														alt={contributor.name}
														className="h-full w-full object-cover"
													/>
												</div>
											))}
											<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
												+{fork.contributors.length}
											</div>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
