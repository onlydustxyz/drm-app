"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Repository, getRepositories } from "@/lib/services/repositories-service";
import { formatDate } from "@/lib/utils";
import {
	GitBranch,
	GitCommit,
	GitPullRequest,
	GitPullRequestClosed,
	MessageSquare,
	Search,
	SlidersHorizontal,
	Star,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EcosystemRepositoriesPage() {
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Repository | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });

	// Filter states
	const [minStars, setMinStars] = useState<number | "">("");
	const [minPRs, setMinPRs] = useState<number | "">("");
	const [minCommits, setMinCommits] = useState<number | "">("");
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	const [activeFiltersCount, setActiveFiltersCount] = useState(0);
	const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

	// Fetch repositories data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const data = await getRepositories();
				setRepositories(data);
				setFilteredRepositories(data);

				// Extract unique languages
				const languages = new Set<string>();
				data.forEach((repo: Repository) => {
					if (repo.languages && Array.isArray(repo.languages) && repo.languages.length > 0) {
						const langName = (repo.languages[0] as { name: string }).name;
						if (langName) languages.add(langName);
					}
				});
				setAvailableLanguages(Array.from(languages));
			} catch (error) {
				console.error("Error fetching repositories:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Apply all filters
	useEffect(() => {
		let filtered = [...repositories];
		let activeFilters = 0;

		// Apply search filter
		if (searchQuery.trim() !== "") {
			const lowercaseQuery = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(repository) =>
					repository.name.toLowerCase().includes(lowercaseQuery) ||
					repository.description.toLowerCase().includes(lowercaseQuery)
			);
		}

		// Apply minimum stars filter
		if (minStars !== "") {
			filtered = filtered.filter((repository) => repository.stars >= Number(minStars));
			activeFilters++;
		}

		// Apply minimum PRs filter
		if (minPRs !== "") {
			filtered = filtered.filter((repository) => repository.prMerged + repository.prOpened >= Number(minPRs));
			activeFilters++;
		}

		// Apply minimum commits filter
		if (minCommits !== "") {
			filtered = filtered.filter((repository) => repository.commits >= Number(minCommits));
			activeFilters++;
		}

		// Apply language filter
		if (selectedLanguage !== "") {
			filtered = filtered.filter((repository) => {
				if (repository.languages && Array.isArray(repository.languages) && repository.languages.length > 0) {
					const langName = (repository.languages[0] as { name: string }).name;
					return langName === selectedLanguage;
				}
				return false;
			});
			activeFilters++;
		}

		setActiveFiltersCount(activeFilters);
		setFilteredRepositories(filtered);
	}, [searchQuery, repositories, minStars, minPRs, minCommits, selectedLanguage]);

	// Handle sorting
	const requestSort = (key: keyof Repository) => {
		let direction: "ascending" | "descending" = "ascending";

		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}

		setSortConfig({ key, direction });

		const sortedData = [...filteredRepositories].sort((a, b) => {
			if (a[key] < b[key]) {
				return direction === "ascending" ? -1 : 1;
			}
			if (a[key] > b[key]) {
				return direction === "ascending" ? 1 : -1;
			}
			return 0;
		});

		setFilteredRepositories(sortedData);
	};

	// Get sort direction indicator
	const getSortDirectionIndicator = (key: keyof Repository) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === "ascending" ? " ↑" : " ↓";
	};

	// Reset all filters
	const resetFilters = () => {
		setMinStars("");
		setMinPRs("");
		setMinCommits("");
		setSelectedLanguage("");
	};

	return (
		<div className="space-y-6 w-full max-w-full">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Ecosystem Repositories</h1>
				<p className="text-muted-foreground">View and manage repositories associated with this ecosystem.</p>
			</div>
			<Separator />

			<div className="space-y-6 w-full max-w-full">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search repositories..."
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
										disabled={!minStars && !minPRs && !minCommits && !selectedLanguage}
									>
										Reset
									</Button>
								</div>
								<Separator />
								<div className="space-y-2">
									<Label htmlFor="min-stars">Minimum Stars</Label>
									<Input
										id="min-stars"
										type="number"
										min="0"
										placeholder="Enter minimum stars"
										value={minStars}
										onChange={(e) => setMinStars(e.target.value ? Number(e.target.value) : "")}
									/>
								</div>
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
										onChange={(e) => setMinCommits(e.target.value ? Number(e.target.value) : "")}
									/>
								</div>
								{availableLanguages.length > 0 && (
									<div className="space-y-2">
										<Label htmlFor="language">Filter by Language</Label>
										<select
											id="language"
											className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
											value={selectedLanguage}
											onChange={(e) => setSelectedLanguage(e.target.value)}
										>
											<option value="">All Languages</option>
											{availableLanguages.map((lang) => (
												<option key={lang} value={lang}>
													{lang}
												</option>
											))}
										</select>
									</div>
								)}
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<Card className="w-full max-w-full">
					<CardHeader>
						<CardTitle>Repository Activity</CardTitle>
						<CardDescription>
							Detailed metrics for all repositories including PRs, issues, and commits.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="flex justify-center items-center h-40">
								<p>Loading repositories data...</p>
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
													onClick={() => requestSort("prMerged")}
												>
													<GitPullRequestClosed className="h-4 w-4" />
													<span>PRs Merged{getSortDirectionIndicator("prMerged")}</span>
												</button>
											</TableHead>
											<TableHead className="text-center">
												<button
													className="flex items-center justify-center gap-1 w-full"
													onClick={() => requestSort("prOpened")}
												>
													<GitPullRequest className="h-4 w-4" />
													<span>PRs Opened{getSortDirectionIndicator("prOpened")}</span>
												</button>
											</TableHead>
											<TableHead className="text-center">
												<button
													className="flex items-center justify-center gap-1 w-full"
													onClick={() => requestSort("issuesOpened")}
												>
													<MessageSquare className="h-4 w-4" />
													<span>
														Issues Opened{getSortDirectionIndicator("issuesOpened")}
													</span>
												</button>
											</TableHead>
											<TableHead className="text-center">
												<button
													className="flex items-center justify-center gap-1 w-full"
													onClick={() => requestSort("issuesClosed")}
												>
													<GitBranch className="h-4 w-4" />
													<span>
														Issues Closed{getSortDirectionIndicator("issuesClosed")}
													</span>
												</button>
											</TableHead>
											<TableHead className="text-center">
												<button
													className="flex items-center justify-center gap-1 w-full"
													onClick={() => requestSort("commits")}
												>
													<GitCommit className="h-4 w-4" />
													<span>Commits{getSortDirectionIndicator("commits")}</span>
												</button>
											</TableHead>
											<TableHead className="text-center">
												<button
													className="flex items-center justify-center gap-1 w-full"
													onClick={() => requestSort("contributors")}
												>
													<Users className="h-4 w-4" />
													<span>Contributors{getSortDirectionIndicator("contributors")}</span>
												</button>
											</TableHead>
											<TableHead className="text-center">
												<button
													className="flex items-center justify-center gap-1 w-full"
													onClick={() => requestSort("stars")}
												>
													<Star className="h-4 w-4 text-yellow-500" />
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
											<TableHead className="w-[100px]">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredRepositories.length === 0 ? (
											<TableRow>
												<TableCell colSpan={10} className="h-24 text-center">
													No repositories found.
												</TableCell>
											</TableRow>
										) : (
											filteredRepositories.map((repo) => (
												<TableRow key={repo.id}>
													<TableCell className="font-medium">
														<div className="flex flex-col">
															<a
																href={repo.url || ""}
																className="hover:underline text-primary"
																target="_blank"
																rel="noopener noreferrer"
															>
																{repo.name}
															</a>
															<span className="text-xs text-muted-foreground mt-1">
																{repo.description}
															</span>
															<div className="mt-1">
																{repo.languages &&
																	Array.isArray(repo.languages) &&
																	repo.languages.length > 0 && (
																		<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
																			{(repo.languages[0] as { name: string })
																				.name ?? "Unknown"}
																		</span>
																	)}
															</div>
														</div>
													</TableCell>
													<TableCell className="text-center">{repo.prMerged}</TableCell>
													<TableCell className="text-center">{repo.prOpened}</TableCell>
													<TableCell className="text-center">{repo.issuesOpened}</TableCell>
													<TableCell className="text-center">{repo.issuesClosed}</TableCell>
													<TableCell className="text-center">{repo.commits}</TableCell>
													<TableCell className="text-center">{repo.contributors}</TableCell>
													<TableCell className="text-center">
														<div className="flex items-center justify-center gap-1">
															<Star className="h-4 w-4 text-yellow-500" />
															<span>{repo.stars}</span>
														</div>
													</TableCell>
													<TableCell className="text-right">
														{formatDate(repo.last_updated_at)}
													</TableCell>
													<TableCell>
														<Link
															href={`/ecosystems/${repo.id}`}
															className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-full"
														>
															View
														</Link>
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
			</div>
		</div>
	);
}
