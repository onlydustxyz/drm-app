"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContributors } from "@/lib/react-query/contributors";
import { Contributor } from "@/lib/services/contributors-service";
import { formatDate } from "@/lib/utils";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ContributorDetailPanel } from "../contributors/contributor-detail-panel";

export default function ContributorsPage({ repoIds }: { repoIds?: string[] }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Contributor | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });
	const [selectedContributorId, setSelectedContributorId] = useState<string | null>(null);
	const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

	// Debounce search query to avoid too many API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Map the component sort direction format to the API format
	const apiSortOrder = sortConfig.direction === "ascending" ? "asc" : "desc";

	// Use the updated React Query hook with search and sort parameters
	const {
		data: contributors = [],
		isLoading: isLoadingContributors,
		error: contributorsError,
	} = useContributors(debouncedSearchQuery || undefined, sortConfig.key || undefined, apiSortOrder, repoIds);

	// Handle sorting
	const requestSort = (key: keyof Contributor) => {
		let direction: "ascending" | "descending" = "ascending";

		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}

		setSortConfig({ key, direction });
	};

	// Handle row click to open detail panel
	const handleRowClick = (contributor: Contributor) => {
		setSelectedContributorId(contributor.id);
		setIsDetailPanelOpen(true);
	};

	// Get sort direction indicator
	const getSortDirectionIndicator = (key: keyof Contributor) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === "ascending" ? " ↑" : " ↓";
	};

	// Check for loading and error states
	const isLoading = isLoadingContributors;
	const error = contributorsError;

	if (error) {
		return (
			<div className="w-full max-w-full py-6">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						{error instanceof Error ? error.message : "An unknown error occurred"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<>
			<Card className="w-full max-w-full">
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<CardTitle>Contributors Activity</CardTitle>
							<CardDescription>
								Detailed metrics for all contributors including PRs, issues, and commits.
							</CardDescription>
						</div>
						<div className="relative w-full md:w-64">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search contributors..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center items-center h-40">
							<Loader2 className="h-8 w-8 animate-spin mr-2" />
							<p>Loading contributors data...</p>
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
												Contributor{getSortDirectionIndicator("name")}
											</button>
										</TableHead>
										<TableHead>
											<button
												className="flex items-center font-medium text-left"
												onClick={() => requestSort("handle")}
											>
												<span>Handle{getSortDirectionIndicator("handle")}</span>
											</button>
										</TableHead>
										<TableHead>
											<button
												className="flex items-center font-medium text-left"
												onClick={() => requestSort("type")}
											>
												<span>Type{getSortDirectionIndicator("type")}</span>
											</button>
										</TableHead>
										<TableHead>
											<button
												className="flex items-center font-medium text-left"
												onClick={() => requestSort("tenure")}
											>
												<span>Tenure{getSortDirectionIndicator("tenure")}</span>
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
												onClick={() => requestSort("commits")}
											>
												<span>Commits{getSortDirectionIndicator("commits")}</span>
											</button>
										</TableHead>
										<TableHead className="text-right">
											<button
												className="flex items-center justify-end w-full"
												onClick={() => requestSort("lastActive")}
											>
												Last Active{getSortDirectionIndicator("lastActive")}
											</button>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{contributors.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8} className="h-24 text-center">
												No contributors found.
											</TableCell>
										</TableRow>
									) : (
										contributors.map((contributor) => (
											<TableRow
												key={contributor.id}
												className="cursor-pointer hover:bg-muted/50"
												onClick={() => handleRowClick(contributor)}
											>
												<TableCell>
													<div className="flex items-center gap-2">
														<Avatar className="h-8 w-8">
															<img src={contributor.avatar} alt={contributor.name} />
														</Avatar>
														<span className="font-medium">{contributor.name}</span>
													</div>
												</TableCell>
												<TableCell>@{contributor.handle}</TableCell>
												<TableCell>
													<Badge variant="secondary">{contributor.type}</Badge>
												</TableCell>
												<TableCell>
													<Badge variant="outline">{contributor.tenure}</Badge>
												</TableCell>
												<TableCell className="text-center">
													<div className="flex items-center justify-center gap-1">
														<span>{contributor.stars}</span>
													</div>
												</TableCell>
												<TableCell className="text-center">{contributor.prMerged}</TableCell>
												<TableCell className="text-center">{contributor.commits}</TableCell>
												<TableCell className="text-right">
													{formatDate(contributor.lastActive)}
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

			{/* Contributor Detail Panel */}
			<ContributorDetailPanel
				contributorId={selectedContributorId}
				isOpen={isDetailPanelOpen}
				onOpenChange={setIsDetailPanelOpen}
			/>
		</>
	);
}
