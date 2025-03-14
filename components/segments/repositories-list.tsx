"use client";

import { RepositoryDetailPanel } from "@/components/repositories/repository-detail-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RepositoryFilter, useRepositories, useRepositoriesBySegmentId } from "@/lib/react-query/repositories";
import { Repository, RepositorySort } from "@/lib/services/repositories-service";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// Define types for repository status
export type RepositoryStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";

// Map colors based on indexing status
export const statusColors: Record<string, string> = {
	PENDING: "bg-yellow-500 dark:bg-yellow-500",
	RUNNING: "bg-blue-500 dark:bg-blue-500",
	SUCCESS: "bg-green-500 dark:bg-green-500",
	FAILED: "bg-red-500 dark:bg-red-500"
};

// Map text based on status
export const statusText: Record<string, string> = {
	PENDING: "Pending",
	RUNNING: "Running",
	SUCCESS: "Success",
	FAILED: "Failed"
};

interface RepositoriesListProps {
	names?: string[];
	segmentId?: string;
}

export function RepositoriesList({ names, segmentId }: RepositoriesListProps) {
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

	// Fetch repositories - either by segment ID if provided, or with regular filtering
	const segmentRepositoriesQuery = useRepositoriesBySegmentId(segmentId ?? "", sort);
	const regularRepositoriesQuery = useRepositories(filter, sort);
	
	// Use the appropriate query result based on whether segmentId is provided
	const { 
		data: repositories = [], 
		isLoading, 
		error 
	} = segmentId ? segmentRepositoriesQuery : regularRepositoriesQuery;

	// If using segment repositories and we have a search query, filter client-side
	const filteredRepositories = debouncedSearchQuery && segmentId 
		? repositories.filter(repo => 
			repo.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
			(repo.description && repo.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
		)
		: repositories;

	// Handle row click to open details panel
	const handleRowClick = (repo: Repository) => {
		setSelectedRepoId(repo.id);
		setIsDetailPanelOpen(true);
	};

	// Handle sort requests
	const requestSort = (field: string) => {
		if (!sort || sort.field !== field) {
			// Initial sort by this field in ascending order
			setSort({
				field: field as any,
				direction: "asc",
			});
		} else if (sort.field === field && sort.direction === "asc") {
			// Switch to descending order
			setSort({
				...sort,
				direction: "desc",
			});
		} else {
			// Remove sort
			setSort(undefined);
		}
	};

	// Visual indicator for sort direction
	const getSortDirectionIndicator = (field: string) => {
		if (!sort || sort.field !== field) {
			return null;
		}
		return sort.direction === "asc" ? " ↑" : " ↓";
	};

	// Display repository status badge
	const getStatusBadge = (status: string) => {
		return (
			<div className="flex justify-center">
				<Badge variant="outline" className="gap-1 px-2 py-1">
					<div className={`w-2 h-2 rounded-full ${statusColors[status] || statusColors.PENDING}`} />
					<div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
					<span>{statusText[status]}</span>
				</Badge>
			</div>
		);
	};

	// Check if the value is already a Date, if not, convert it
	const formatRepoDate = (dateValue: string | Date) => {
		if (typeof dateValue === 'string') {
			return formatDate(dateValue);
		}
		return formatDate(dateValue.toISOString());
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
												onClick={() => requestSort("updated_at")}
											>
												<span>Last Updated{getSortDirectionIndicator("updated_at")}</span>
											</button>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredRepositories.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8} className="text-center py-8">
												No repositories found.
											</TableCell>
										</TableRow>
									) : (
										filteredRepositories.map((repo) => {
											return (
												<TableRow
													key={repo.id}
													className="cursor-pointer hover:bg-muted"
													onClick={() => handleRowClick(repo)}
												>
													<TableCell className="font-medium">{repo.name}</TableCell>
													<TableCell className="text-center">
														{getStatusBadge(repo.indexingStatus || "PENDING")}
													</TableCell>
													<TableCell className="text-center">{repo.prMerged}</TableCell>
													<TableCell className="text-center">{repo.prOpened}</TableCell>
													<TableCell className="text-center">{repo.issuesOpened}</TableCell>
													<TableCell className="text-center">{repo.issuesClosed}</TableCell>
													<TableCell className="text-center">{repo.commits}</TableCell>
													<TableCell className="text-center">
														{formatRepoDate(repo.last_updated_at)}
													</TableCell>
												</TableRow>
											);
										})
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
