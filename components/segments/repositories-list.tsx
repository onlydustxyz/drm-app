"use client";

import { RepositoryDetailPanel } from "@/components/repositories/repository-detail-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RepositoryFilter, useRepositories } from "@/lib/react-query/repositories";
import { Repository, RepositorySort } from "@/lib/services/repositories-service";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// Define types for repository status
export type RepositoryStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";

// Status badge component with appropriate colors
interface StatusBadgeProps {
	status: RepositoryStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
	const statusConfig: Record<
		RepositoryStatus,
		{ variant: "secondary" | "blue" | "success" | "destructive"; label: string }
	> = {
		PENDING: { variant: "secondary", label: "Pending" },
		RUNNING: { variant: "blue", label: "Running" },
		SUCCESS: { variant: "success", label: "Success" },
		FAILED: { variant: "destructive", label: "Failed" },
	};

	const config = statusConfig[status];

	return (
		<Badge variant={config.variant} className="text-xs font-medium">
			{config.label}
		</Badge>
	);
}

interface RepositoriesListProps {
	names?: string[];
}

export function RepositoriesList({ names }: RepositoriesListProps) {
	// State for search and sort
	const [searchQuery, setSearchQuery] = useState("");
	const [sort, setSort] = useState<RepositorySort | undefined>();
	const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
	const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

	// Debounced search query for API requests
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

	// Debounce search query to avoid too many API requests
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchQuery]);

	// Build filter parameters for the API
	const filter: RepositoryFilter = {};
	if (names && names.length > 0) filter.names = names;
	if (debouncedSearchQuery) filter.search = debouncedSearchQuery;

	// Fetch repositories with API-based filtering and sorting
	const { data: repositories = [], isLoading, error } = useRepositories(filter, sort);

	// Mock repository status data
	const mockStatus = (repoId: string): RepositoryStatus => {
		// Deterministic but random-looking status based on repository ID
		const statuses: RepositoryStatus[] = ["PENDING", "RUNNING", "SUCCESS", "FAILED"];
		const hash = repoId.split("").reduce((a, b) => {
			return a + b.charCodeAt(0);
		}, 0);
		return statuses[hash % statuses.length];
	};

	// Handle row click to open details panel
	const handleRowClick = (repo: Repository) => {
		setSelectedRepoId(repo.id);
		setIsDetailPanelOpen(true);
	};

	// Handle sorting
	const requestSort = (key: keyof Repository | "status") => {
		// Map component sort fields to API sort fields
		const apiSortFieldMap: Record<string, any> = {
			name: "name",
			stars: "stars",
			forks: "forks",
			last_updated_at: "updated_at",
		};

		// For status column, we don't do API sorting since it's mocked data
		if (key === "status") {
			// We could add client-side sorting here if needed
			return;
		}

		// Only use sortable fields that the API supports
		if (!apiSortFieldMap[key as keyof Repository]) {
			// For fields not supported by the API, we won't do anything
			// Fields like prMerged, prOpened, etc. are not sortable via API
			return;
		}

		const apiSortField = apiSortFieldMap[key as keyof Repository] as
			| "name"
			| "stars"
			| "forks"
			| "updated_at"
			| "created_at";

		// Toggle sort direction or set initial sort
		if (sort && sort.field === apiSortField) {
			// Toggle direction if same field
			setSort({
				field: apiSortField,
				direction: sort.direction === "asc" ? "desc" : "asc",
			});
		} else {
			// Default to descending for new sort field
			setSort({
				field: apiSortField,
				direction: "desc",
			});
		}
	};

	// Get sort direction indicator
	const getSortDirectionIndicator = (key: keyof Repository | "status") => {
		// Status column has no sorting indicator since it's client-side
		if (key === "status") {
			return null;
		}

		// Map component fields to API fields
		const apiFieldMap: Record<string, any> = {
			name: "name",
			stars: "stars",
			forks: "forks",
			last_updated_at: "updated_at",
		};

		const apiField = apiFieldMap[key as keyof Repository];

		if (!apiField || !sort || sort.field !== apiField) return null;
		return sort.direction === "asc" ? " ↑" : " ↓";
	};

	return (
		<>
			<Card className="w-full max-w-full">
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<CardTitle>Repositories</CardTitle>
							<CardDescription>
								Detailed metrics for all repositories including PRs, issues, and commits.
							</CardDescription>
						</div>
						<div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
							<div className="relative w-full md:w-64">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search repositories..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center items-center h-40">
							<p>Loading repositories data...</p>
						</div>
					) : error ? (
						<div className="flex justify-center items-center h-40 text-red-500">
							<p>Error loading repositories: {(error as Error).message}</p>
						</div>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											<button
												className="flex items-center font-medium text-left"
												onClick={() => requestSort("name")}
											>
												Repository{getSortDirectionIndicator("name")}
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("status")}
											>
												<span>Status{getSortDirectionIndicator("status")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("prMerged")}
											>
												<span>PRs Merged{getSortDirectionIndicator("prMerged")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("prOpened")}
											>
												<span>PRs Opened{getSortDirectionIndicator("prOpened")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("issuesOpened")}
											>
												<span>Issues Opened{getSortDirectionIndicator("issuesOpened")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("issuesClosed")}
											>
												<span>Issues Closed{getSortDirectionIndicator("issuesClosed")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("commits")}
											>
												<span>Commits{getSortDirectionIndicator("commits")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("contributors")}
											>
												<span>Contributors{getSortDirectionIndicator("contributors")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("stars")}
											>
												<span>Stars{getSortDirectionIndicator("stars")}</span>
											</button>
										</TableHead>
										<TableHead className="text-right">
											<button
												className="flex items-center justify-end w-full"
												onClick={() => requestSort("last_updated_at")}
											>
												Last Updated{getSortDirectionIndicator("last_updated_at")}
											</button>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{repositories.length === 0 ? (
										<TableRow>
											<TableCell colSpan={10} className="h-24 text-center">
												No repositories found.
											</TableCell>
										</TableRow>
									) : (
										repositories.map((repo) => (
											<TableRow
												key={repo.id}
												onClick={() => handleRowClick(repo)}
												className="cursor-pointer hover:bg-muted/50"
											>
												<TableCell className="font-medium">
													<div className="flex flex-col">
														<a
															href={repo.url || ""}
															className="hover:underline text-primary"
															target="_blank"
															rel="noopener noreferrer"
															onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the link
														>
															{repo.name}
														</a>
														<span className="text-xs text-muted-foreground mt-1">
															{repo.description}
														</span>
													</div>
												</TableCell>
												<TableCell className="text-center">
													<div className="flex justify-center">
														<StatusBadge status={mockStatus(repo.id)} />
													</div>
												</TableCell>
												<TableCell className="text-center">{repo.prMerged}</TableCell>
												<TableCell className="text-center">{repo.prOpened}</TableCell>
												<TableCell className="text-center">{repo.issuesOpened}</TableCell>
												<TableCell className="text-center">{repo.issuesClosed}</TableCell>
												<TableCell className="text-center">{repo.commits}</TableCell>
												<TableCell className="text-center">{repo.contributors}</TableCell>
												<TableCell className="text-center">
													<span>{repo.stars}</span>
												</TableCell>
												<TableCell className="text-right">
													{formatDate(repo.last_updated_at)}
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Repository Detail Side Panel */}
			<RepositoryDetailPanel
				repositoryId={selectedRepoId}
				isOpen={isDetailPanelOpen}
				onOpenChange={setIsDetailPanelOpen}
			/>
		</>
	);
}
