"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useCreateRepositorySublist, useRepositories, useRepositorySublists } from "@/lib/react-query/repositories";
import { Repository } from "@/lib/services/repositories-service";
import { formatDate } from "@/lib/utils";
import { ChevronDown, PlusCircle, Search, SlidersHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RepositoriesPage() {
	const { data: repositories = [], isLoading, error } = useRepositories();
	const { data: sublists = [] } = useRepositorySublists();
	const createSublist = useCreateRepositorySublist();

	const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRepositories, setSelectedRepositories] = useState<string[]>([]);
	const [isAddToListDialogOpen, setIsAddToListDialogOpen] = useState(false);
	const [newListName, setNewListName] = useState("");
	const [newListDescription, setNewListDescription] = useState("");
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

	// Handle repository selection
	const toggleRepositorySelection = (repositoryId: string) => {
		setSelectedRepositories((prev) =>
			prev.includes(repositoryId) ? prev.filter((id) => id !== repositoryId) : [...prev, repositoryId]
		);
	};

	// Handle select all repositories
	const toggleSelectAll = () => {
		if (selectedRepositories.length === filteredRepositories.length) {
			setSelectedRepositories([]);
		} else {
			setSelectedRepositories(filteredRepositories.map((c) => c.id));
		}
	};

	// Handle creating a new repository sublist
	const handleCreateSublist = async () => {
		if (!newListName.trim()) return;

		try {
			await createSublist.mutateAsync({
				name: newListName,
				description: newListDescription,
				repositoryIds: selectedRepositories,
			});

			setNewListName("");
			setNewListDescription("");
			setSelectedRepositories([]);
			setIsAddToListDialogOpen(false);

			toast({
				title: "List created",
				description: `New list "${newListName}" created with ${selectedRepositories.length} repositories`,
			});
		} catch (error) {
			console.error("Error creating list:", error);
			toast({
				title: "Error",
				description: "Failed to create list",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="space-y-6 w-full max-w-full">
			<div className="flex justify-between items-center mb-6 w-full">
				<div>
					<h1 className="text-3xl font-bold">Repositories</h1>
					<p className="text-muted-foreground">
						View and manage repositories associated with this ecosystem.
					</p>
				</div>
				<div className="flex space-x-2">
					{selectedRepositories.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="default">
									<PlusCircle className="mr-2 h-4 w-4" />
									Add to List
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>Add to List</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{sublists.length > 0 ? (
									<>
										<DropdownMenuGroup>
											{sublists.map((sublist) => (
												<DropdownMenuItem key={sublist.id}>{sublist.name}</DropdownMenuItem>
											))}
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
									</>
								) : null}
								<DropdownMenuItem onClick={() => setIsAddToListDialogOpen(true)}>
									<PlusCircle className="mr-2 h-4 w-4" />
									Create New List
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					<Button variant="default">
						<Users className="mr-2 h-4 w-4" />
						Add Contributors
					</Button>
					<Link href="/repositories/sublists">
						<Button variant="outline">
							<Users className="mr-2 h-4 w-4" />
							Manage Sublists
						</Button>
					</Link>
				</div>
			</div>
			<Separator className="mb-6" />

			<Card className="w-full max-w-full">
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<CardTitle>Repository Activity</CardTitle>
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
												onChange={(e) =>
													setMinStars(e.target.value ? Number(e.target.value) : "")
												}
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
												onChange={(e) =>
													setMinPRs(e.target.value ? Number(e.target.value) : "")
												}
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
										<TableHead className="w-[50px]">
											<Checkbox
												checked={
													selectedRepositories.length === filteredRepositories.length &&
													filteredRepositories.length > 0
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
											<TableCell colSpan={9} className="h-24 text-center">
												No repositories found.
											</TableCell>
										</TableRow>
									) : (
										filteredRepositories.map((repo) => (
											<TableRow key={repo.id}>
												<TableCell>
													<Checkbox
														checked={selectedRepositories.includes(repo.id)}
														onCheckedChange={() => toggleRepositorySelection(repo.id)}
														aria-label={`Select ${repo.name}`}
													/>
												</TableCell>
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

			{/* Dialog for creating a new list */}
			<Dialog open={isAddToListDialogOpen} onOpenChange={setIsAddToListDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New List</DialogTitle>
						<DialogDescription>Create a new list with the selected repositories.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="list-name">List Name</Label>
							<Input
								id="list-name"
								placeholder="Enter list name"
								value={newListName}
								onChange={(e) => setNewListName(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="list-description">Description (optional)</Label>
							<Input
								id="list-description"
								placeholder="Enter description"
								value={newListDescription}
								onChange={(e) => setNewListDescription(e.target.value)}
							/>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								{selectedRepositories.length} repositories will be added to this list.
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddToListDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleCreateSublist} disabled={!newListName.trim() || createSublist.isPending}>
							{createSublist.isPending ? "Creating..." : "Create List"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
