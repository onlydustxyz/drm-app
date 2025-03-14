"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Contributor } from "@/lib/services/contributors-service";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	Building,
	Code,
	ExternalLink,
	GitCommit,
	Github,
	Globe,
	Linkedin,
	Loader2,
	MapPin,
	Search,
	SlidersHorizontal,
	Twitter,
} from "lucide-react";
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

	// Filter states
	const [minPRs, setMinPRs] = useState<number | "">("");
	const [minCommits, setMinCommits] = useState<number | "">("");
	const [showActiveOnly, setShowActiveOnly] = useState(false);
	const [activeFiltersCount, setActiveFiltersCount] = useState(0);

	// Selection states
	const [selectedContributors, setSelectedContributors] = useState<string[]>([]);

	// Add contributors by GitHub handles states
	const [isAddContributorsDialogOpen, setIsAddContributorsDialogOpen] = useState(false);
	const [githubHandles, setGithubHandles] = useState("");
	const [importError, setImportError] = useState("");
	const [importSuccess, setImportSuccess] = useState("");
	const [selectedListsForNewContributors, setSelectedListsForNewContributors] = useState<string[]>([]);

	const [newContributorsToAdd, setNewContributorsToAdd] = useState<Contributor[]>([]);

	// Add new state for expanded rows
	const [expandedRows, setExpandedRows] = useState<string[]>([]);

	// Use React Query for data fetching
	const {
		data: contributors = [],
		isLoading: isLoadingContributors,
		error: contributorsError,
	} = useQuery({
		queryKey: ["contributors"],
		queryFn: fetchContributors,
	});

	// Toggle row expansion
	const toggleRowExpansion = (contributorId: string) => {
		setExpandedRows((prev) =>
			prev.includes(contributorId) ? prev.filter((id) => id !== contributorId) : [...prev, contributorId]
		);
	};

	// Apply all filters
	useEffect(() => {
		if (!contributors.length) return;

		let filtered = [...contributors];
		let activeFilters = 0;

		// Apply search filter
		if (searchQuery.trim() !== "") {
			const lowercaseQuery = searchQuery.toLowerCase();
			filtered = filtered.filter((contributor) => contributor.name.toLowerCase().includes(lowercaseQuery));
		}

		// Apply minimum PRs filter
		if (minPRs !== "") {
			filtered = filtered.filter((contributor) => contributor.prMerged + contributor.prOpened >= Number(minPRs));
			activeFilters++;
		}

		// Apply minimum commits filter
		if (minCommits !== "") {
			filtered = filtered.filter((contributor) => contributor.commits >= Number(minCommits));
			activeFilters++;
		}

		// Apply active only filter
		if (showActiveOnly) {
			// Consider contributors active if they have activity in the last 30 days
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

			filtered = filtered.filter((contributor) => {
				const lastActiveDate = new Date(contributor.lastActive);
				return lastActiveDate >= thirtyDaysAgo;
			});
			activeFilters++;
		}

		setActiveFiltersCount(activeFilters);
		setFilteredContributors(filtered);
	}, [searchQuery, contributors, minPRs, minCommits, showActiveOnly]);

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

	// Reset all filters
	const resetFilters = () => {
		setMinPRs("");
		setMinCommits("");
		setShowActiveOnly(false);
	};

	// Handle contributor selection
	const toggleContributorSelection = (contributorId: string) => {
		setSelectedContributors((prev) =>
			prev.includes(contributorId) ? prev.filter((id) => id !== contributorId) : [...prev, contributorId]
		);
	};

	// Handle select all contributors
	const toggleSelectAll = () => {
		if (selectedContributors.length === filteredContributors.length) {
			setSelectedContributors([]);
		} else {
			setSelectedContributors(filteredContributors.map((c) => c.id));
		}
	};

	// Handle adding contributors by GitHub handles
	const handleAddContributors = () => {
		setIsAddContributorsDialogOpen(true);
		setGithubHandles("");
		setImportError("");
		setImportSuccess("");
		setSelectedListsForNewContributors([]);
		setNewContributorsToAdd([]);
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
					<div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
						<div className="relative w-full md:w-64">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search contributors..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" size="icon" className="shrink-0 relative">
									<SlidersHorizontal className="h-4 w-4" />
									{activeFiltersCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
											{activeFiltersCount}
										</span>
									)}
									<span className="sr-only">Filters</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h4 className="font-medium">Filters</h4>
										<Button
											variant="ghost"
											size="sm"
											onClick={resetFilters}
											disabled={!minPRs && !minCommits && !showActiveOnly}
										>
											Reset
										</Button>
									</div>
									<Separator />
									<div className="space-y-2">
										<Label htmlFor="min-prs">Minimum PRs (opened + merged)</Label>
										<Input
											id="min-prs"
											type="number"
											min="0"
											placeholder="Enter minimum PRs"
											value={minPRs}
											onChange={(e) => setMinPRs(e.target.value ? Number(e.target.value) : "")}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="min-commits">Minimum Commits</Label>
										<Input
											id="min-commits"
											type="number"
											min="0"
											placeholder="Enter minimum commits"
											value={minCommits}
											onChange={(e) =>
												setMinCommits(e.target.value ? Number(e.target.value) : "")
											}
										/>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="active-only"
											checked={showActiveOnly}
											onCheckedChange={(checked) => setShowActiveOnly(checked === true)}
										/>
										<Label htmlFor="active-only">
											Show active contributors only (last 30 days)
										</Label>
									</div>
								</div>
							</PopoverContent>
						</Popover>
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
									<TableHead className="w-[50px]">
										<Checkbox
											checked={
												selectedContributors.length === filteredContributors.length &&
												filteredContributors.length > 0
											}
											onCheckedChange={toggleSelectAll}
											aria-label="Select all"
										/>
									</TableHead>
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
										<TableCell colSpan={12} className="h-24 text-center">
											No contributors found.
										</TableCell>
									</TableRow>
								) : (
									filteredContributors.map((contributor) => (
										<>
											<TableRow
												key={contributor.id}
												className={
													selectedContributors.includes(contributor.id) ? "bg-muted/50" : ""
												}
												onClick={() => toggleRowExpansion(contributor.id)}
												style={{ cursor: "pointer" }}
											>
												<TableCell onClick={(e) => e.stopPropagation()}>
													<Checkbox
														checked={selectedContributors.includes(contributor.id)}
														onCheckedChange={() =>
															toggleContributorSelection(contributor.id)
														}
														aria-label={`Select ${contributor.name}`}
													/>
												</TableCell>
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
											{expandedRows.includes(contributor.id) && (
												<TableRow className="bg-muted/20">
													<TableCell colSpan={12} className="p-4">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<div>
																<h3 className="text-lg font-medium mb-2">Profile</h3>
																<div className="space-y-2">
																	<div>
																		<span className="text-sm text-muted-foreground">
																			Description:
																		</span>
																		<p>{contributor.description}</p>
																	</div>
																	<div className="flex items-center gap-1">
																		<MapPin className="h-4 w-4 text-muted-foreground" />
																		<span>{contributor.location}</span>
																	</div>
																	{contributor.organizations.length > 0 && (
																		<div className="flex items-center gap-1">
																			<Building className="h-4 w-4 text-muted-foreground" />
																			<div className="flex flex-wrap gap-1">
																				{contributor.organizations.map(
																					(org: string, index: number) => (
																						<Badge
																							key={index}
																							variant="outline"
																						>
																							{org}
																						</Badge>
																					)
																				)}
																			</div>
																		</div>
																	)}
																	<div className="flex items-center gap-2">
																		{contributor.socialLinks.github && (
																			<TooltipProvider>
																				<Tooltip>
																					<TooltipTrigger asChild>
																						<a
																							href={
																								contributor.socialLinks
																									.github
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Github className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
																						</a>
																					</TooltipTrigger>
																					<TooltipContent>
																						<p>GitHub</p>
																					</TooltipContent>
																				</Tooltip>
																			</TooltipProvider>
																		)}
																		{contributor.socialLinks.twitter && (
																			<TooltipProvider>
																				<Tooltip>
																					<TooltipTrigger asChild>
																						<a
																							href={
																								contributor.socialLinks
																									.twitter
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Twitter className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
																						</a>
																					</TooltipTrigger>
																					<TooltipContent>
																						<p>Twitter</p>
																					</TooltipContent>
																				</Tooltip>
																			</TooltipProvider>
																		)}
																		{contributor.socialLinks.linkedin && (
																			<TooltipProvider>
																				<Tooltip>
																					<TooltipTrigger asChild>
																						<a
																							href={
																								contributor.socialLinks
																									.linkedin
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Linkedin className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
																						</a>
																					</TooltipTrigger>
																					<TooltipContent>
																						<p>LinkedIn</p>
																					</TooltipContent>
																				</Tooltip>
																			</TooltipProvider>
																		)}
																		{contributor.socialLinks.website && (
																			<TooltipProvider>
																				<Tooltip>
																					<TooltipTrigger asChild>
																						<a
																							href={
																								contributor.socialLinks
																									.website
																							}
																							target="_blank"
																							rel="noopener noreferrer"
																						>
																							<Globe className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
																						</a>
																					</TooltipTrigger>
																					<TooltipContent>
																						<p>Website</p>
																					</TooltipContent>
																				</Tooltip>
																			</TooltipProvider>
																		)}
																	</div>
																</div>
															</div>
															<div>
																<h3 className="text-lg font-medium mb-2">Activity</h3>
																<div className="space-y-2">
																	<div>
																		<span className="text-sm text-muted-foreground">
																			Latest Commit:
																		</span>
																		<div className="flex items-center gap-1 mt-1">
																			<GitCommit className="h-4 w-4 text-muted-foreground" />
																			<a
																				href={contributor.latestCommit.url}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="text-sm hover:underline flex items-center gap-1"
																			>
																				{contributor.latestCommit.message}
																				<ExternalLink className="h-3 w-3" />
																			</a>
																		</div>
																		<div className="text-xs text-muted-foreground mt-1">
																			{formatDate(contributor.latestCommit.date)}
																		</div>
																	</div>
																	<div>
																		<span className="text-sm text-muted-foreground">
																			Languages:
																		</span>
																		<div className="flex flex-wrap gap-1 mt-1">
																			{contributor.languages.map(
																				(lang: any, index: number) => (
																					<Badge
																						key={index}
																						variant="outline"
																						className="flex items-center gap-1 text-slate-700 dark:text-slate-300"
																					>
																						<Code className="h-3 w-3" />
																						{lang.name} ({lang.percentage}%)
																					</Badge>
																				)
																			)}
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</TableCell>
												</TableRow>
											)}
										</>
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
