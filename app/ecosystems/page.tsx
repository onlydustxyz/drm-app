import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Calendar, Eye, GitFork, Star } from "lucide-react";
import Link from "next/link";

export default async function EcosystemRepositoriesPage() {
	// Fetch repositories from Supabase
	const supabase = await createClient();
	const { data: repositories, error } = await supabase.from("repositories").select();

	if (error) {
		console.error("Error fetching repositories:", error);
	}

	// Use empty array as fallback if there's an error or no data
	const repoData = repositories || [];

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
							<TableHead>Last Updated</TableHead>
							<TableHead className="w-[150px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{repoData.map((repo) => (
							<TableRow key={repo.id}>
								<TableCell className="font-medium">
									<a
										href={repo.url || ""}
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
										{repo.languages && Array.isArray(repo.languages) && repo.languages.length > 0
											? (repo.languages[0] as { name: string }).name ?? "Unknown"
											: "Unknown"}
									</span>
								</TableCell>

								<TableCell>
									<div className="flex items-center gap-1">
										<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">{repo.last_updated_at}</span>
									</div>
								</TableCell>
								<TableCell>
									<Link
										href={`/ecosystems/${repo.id}`}
										className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-full"
									>
										View Details
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
