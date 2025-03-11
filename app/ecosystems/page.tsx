import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Eye, GitFork, Star } from "lucide-react";

// Mock data for repositories
const repositories = [
	{
		id: 1,
		name: "blockchain-core",
		description: "Core blockchain implementation for the ecosystem",
		url: "https://github.com/ecosystem/blockchain-core",
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
		stars: 412,
		forks: 87,
		watchers: 42,
		lastUpdated: "2024-02-25",
		primaryLanguage: "Python",
		license: "GPL-3.0",
	},
];

export default function EcosystemRepositoriesPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Ecosystem Repositories</h1>
				<p className="text-muted-foreground">View and manage repositories associated with this ecosystem.</p>
			</div>
			<Separator />

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[300px]">Repository</TableHead>
							<TableHead>Description</TableHead>
							<TableHead className="text-center">Stars</TableHead>
							<TableHead className="text-center">Forks</TableHead>
							<TableHead className="text-center">Watchers</TableHead>
							<TableHead>Language</TableHead>
							<TableHead>License</TableHead>
							<TableHead>Last Updated</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{repositories.map((repo) => (
							<TableRow key={repo.id}>
								<TableCell className="font-medium">
									<a
										href={repo.url}
										className="hover:underline text-primary"
										target="_blank"
										rel="noopener noreferrer"
									>
										{repo.name}
									</a>
								</TableCell>
								<TableCell>{repo.description}</TableCell>
								<TableCell className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Star className="h-4 w-4 text-yellow-500" />
										<span>{repo.stars}</span>
									</div>
								</TableCell>
								<TableCell className="text-center">
									<div className="flex items-center justify-center gap-1">
										<GitFork className="h-4 w-4 text-gray-500" />
										<span>{repo.forks}</span>
									</div>
								</TableCell>
								<TableCell className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Eye className="h-4 w-4 text-blue-500" />
										<span>{repo.watchers}</span>
									</div>
								</TableCell>
								<TableCell>
									<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
										{repo.primaryLanguage}
									</span>
								</TableCell>
								<TableCell>
									<span className="text-xs text-muted-foreground">{repo.license}</span>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">{repo.lastUpdated}</span>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
