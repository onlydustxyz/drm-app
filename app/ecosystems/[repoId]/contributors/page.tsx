import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import ActivityPattern from "./activity-pattern";
import ContributorAvatar from "./contributor-avatar";

// Mock data for repository
const repository = {
	id: 1,
	name: "blockchain-core",
	description: "Core blockchain implementation for the ecosystem",
};

// Mock data for contributors
const contributors = [
	{
		id: 1,
		name: "Alex Johnson",
		avatar: "https://github.com/alexjohnson.png",
		username: "alexj",
		role: "Maintainer",
		contributions: 324,
		lastContribution: "2024-03-10",
		firstContribution: "2023-01-15",
		contributionFrequency: "Daily",
		activePeriods: [
			{ start: "2023-01", end: "2023-06", intensity: "high" },
			{ start: "2023-08", end: "2024-03", intensity: "high" },
		],
		inactivePeriods: [{ start: "2023-06", end: "2023-08", reason: "Vacation" }],
	},
	{
		id: 2,
		name: "Maria Garcia",
		avatar: "https://github.com/mariagarcia.png",
		username: "mgarcia",
		role: "Core Contributor",
		contributions: 187,
		lastContribution: "2024-03-05",
		firstContribution: "2023-02-20",
		contributionFrequency: "Weekly",
		activePeriods: [
			{ start: "2023-02", end: "2023-11", intensity: "medium" },
			{ start: "2024-01", end: "2024-03", intensity: "high" },
		],
		inactivePeriods: [{ start: "2023-11", end: "2024-01", reason: "Holiday break" }],
	},
	{
		id: 3,
		name: "Dev Patel",
		avatar: "https://github.com/devpatel.png",
		username: "devp",
		role: "Feature Contributor",
		contributions: 92,
		lastContribution: "2024-02-28",
		firstContribution: "2023-03-10",
		contributionFrequency: "Monthly",
		activePeriods: [
			{ start: "2023-03", end: "2023-05", intensity: "low" },
			{ start: "2023-08", end: "2023-12", intensity: "medium" },
			{ start: "2024-02", end: "2024-03", intensity: "medium" },
		],
		inactivePeriods: [
			{ start: "2023-05", end: "2023-08", reason: "Other projects" },
			{ start: "2023-12", end: "2024-02", reason: "Holiday break" },
		],
	},
	{
		id: 4,
		name: "Sarah Kim",
		avatar: "https://github.com/sarahkim.png",
		username: "skim",
		role: "Documentation",
		contributions: 64,
		lastContribution: "2024-03-08",
		firstContribution: "2023-04-05",
		contributionFrequency: "Bi-weekly",
		activePeriods: [
			{ start: "2023-04", end: "2023-09", intensity: "medium" },
			{ start: "2023-10", end: "2024-03", intensity: "low" },
		],
		inactivePeriods: [],
	},
	{
		id: 5,
		name: "Carlos Mendez",
		avatar: "https://github.com/carlosmendez.png",
		username: "cmendez",
		role: "Security Auditor",
		contributions: 43,
		lastContribution: "2024-01-20",
		firstContribution: "2023-05-12",
		contributionFrequency: "Sporadic",
		activePeriods: [
			{ start: "2023-05", end: "2023-07", intensity: "high" },
			{ start: "2023-11", end: "2024-01", intensity: "medium" },
		],
		inactivePeriods: [
			{ start: "2023-07", end: "2023-11", reason: "Other projects" },
			{ start: "2024-01", end: "2024-03", reason: "Sabbatical" },
		],
	},
];

function getContributionFrequencyColor(frequency: string) {
	switch (frequency) {
		case "Daily":
			return "bg-green-100 text-green-800";
		case "Weekly":
			return "bg-blue-100 text-blue-800";
		case "Bi-weekly":
			return "bg-purple-100 text-purple-800";
		case "Monthly":
			return "bg-yellow-100 text-yellow-800";
		case "Sporadic":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

function getContributorRoleColor(role: string) {
	switch (role) {
		case "Maintainer":
			return "bg-red-100 text-red-800";
		case "Core Contributor":
			return "bg-blue-100 text-blue-800";
		case "Feature Contributor":
			return "bg-green-100 text-green-800";
		case "Documentation":
			return "bg-purple-100 text-purple-800";
		case "Security Auditor":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

export default function ContributorsPage({ params }: { params: { repoId: string } }) {
	const repoId = params.repoId;
	
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{repository.name} - Contributors</h1>
					<p className="text-muted-foreground">View contributors, their roles, and contribution patterns.</p>
				</div>

				<Link
					href={`/ecosystems/${repoId}`}
					className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
				>
					Back to Repository
				</Link>
			</div>

			<Separator />

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[200px]">Contributor</TableHead>
							<TableHead className="w-[120px]">Role</TableHead>
							<TableHead className="text-center">Contributions</TableHead>
							<TableHead className="w-[140px]">Frequency</TableHead>
							<TableHead>First Contribution</TableHead>
							<TableHead>Latest Contribution</TableHead>
							<TableHead className="w-[250px]">Activity Pattern</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{contributors.map((contributor) => (
							<TableRow key={contributor.id}>
								<TableCell>
									<div className="flex items-center gap-2">
										<ContributorAvatar name={contributor.name} avatar={contributor.avatar} />
										<div>
											<div className="font-medium">{contributor.name}</div>
											<div className="text-xs text-muted-foreground">@{contributor.username}</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getContributorRoleColor(
											contributor.role
										)}`}
									>
										{contributor.role}
									</span>
								</TableCell>
								<TableCell className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Activity className="h-4 w-4 text-gray-500" />
										<span>{contributor.contributions}</span>
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getContributionFrequencyColor(
											contributor.contributionFrequency
										)}`}
									>
										{contributor.contributionFrequency}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">
											{contributor.firstContribution}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Clock className="h-3.5 w-3.5 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">
											{contributor.lastContribution}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<ActivityPattern contributor={contributor} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
