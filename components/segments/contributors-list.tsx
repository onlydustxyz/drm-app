"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contributor } from "@/lib/services/contributors-service";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

// API fetch functions
const fetchContributors = async (): Promise<Contributor[]> => {
	const response = await fetch("/api/contributors");
	if (!response.ok) {
		throw new Error("Failed to fetch contributors");
	}
	return response.json();
};

export default function ContributorsPage() {
	const [filteredContributors, setFilteredContributors] = useState<Contributor[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Contributor | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });

	// Use React Query for data fetching
	const {
		data: contributors = [],
		isLoading: isLoadingContributors,
		error: contributorsError,
	} = useQuery({
		queryKey: ["contributors"],
		queryFn: fetchContributors,
	});

	// Apply search filter
	useEffect(() => {
		if (!contributors.length) return;

		let filtered = [...contributors];

		// Apply search filter
		if (searchQuery.trim() !== "") {
			const lowercaseQuery = searchQuery.toLowerCase();
			filtered = filtered.filter((contributor) => contributor.name.toLowerCase().includes(lowercaseQuery));
		}

		setFilteredContributors(filtered);
	}, [searchQuery, contributors]);

	// Handle sorting
	const requestSort = (key: keyof Contributor) => {
		let direction: "ascending" | "descending" = "ascending";

		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}

		setSortConfig({ key, direction });

		const sortedData = [...filteredContributors].sort((a, b) => {
			if (a[key] < b[key]) {
				return direction === "ascending" ? -1 : 1;
			}
			if (a[key] > b[key]) {
				return direction === "ascending" ? 1 : -1;
			}
			return 0;
		});

		setFilteredContributors(sortedData);
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
								{filteredContributors.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-24 text-center">
											No contributors found.
										</TableCell>
									</TableRow>
								) : (
									filteredContributors.map((contributor) => (
										<TableRow key={contributor.id}>
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
	);
}
