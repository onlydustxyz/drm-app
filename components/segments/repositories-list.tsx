"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RepositoryFilter, useRepositories } from "@/lib/react-query/repositories";
import { Repository } from "@/lib/services/repositories-service";
import { formatDate } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface RepositoriesListProps {
	names?: string[];
}

export function RepositoriesList({ names }: RepositoriesListProps) {
	const filter: RepositoryFilter = {};
	if (names && names.length > 0) filter.names = names;

	const { data: repositories = [], isLoading, error } = useRepositories(filter);

	const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
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

	// Extract unique languages when repositories data changes
	useEffect(() => {
		if (repositories.length > 0) {
			// Extract unique languages
			const languages = new Set<string>();
			repositories.forEach((repo: Repository) => {
				if (repo.languages && Array.isArray(repo.languages) && repo.languages.length > 0) {
					const langName = (repo.languages[0] as { name: string }).name;
					if (langName) languages.add(langName);
				}
			});
			setAvailableLanguages(Array.from(languages));
			setFilteredRepositories(repositories);
		}
	}, [repositories]);

	// Apply all filters
	useEffect(() => {
		if (repositories.length === 0) return;

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
											onChange={(e) =>
												setMinCommits(e.target.value ? Number(e.target.value) : "")
											}
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
								{filteredRepositories.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-24 text-center">
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
	);
}
