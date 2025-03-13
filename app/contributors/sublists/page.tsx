"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ContributorSublist } from "@/lib/services/contributor-sublists-service";
import { Contributor } from "@/lib/services/contributors-service";
import { formatDate } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ChevronRight, Import, Loader2, Plus, Search, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";

// API fetch functions
const fetchContributors = async (): Promise<Contributor[]> => {
	const response = await fetch("/api/contributors");
	if (!response.ok) {
		throw new Error("Failed to fetch contributors");
	}
	return response.json();
};

const fetchSublists = async (options?: {
	search?: string;
	sort?: {
		key?: keyof ContributorSublist;
		direction?: "ascending" | "descending";
	};
}): Promise<ContributorSublist[]> => {
	const params = new URLSearchParams();

	if (options?.search && options.search.trim() !== "") {
		params.append("search", options.search.trim());
	}

	if (options?.sort?.key) {
		params.append("sortKey", options.sort.key);
		params.append("sortDirection", options.sort.direction || "ascending");
	}

	const url = `/api/contributor-sublists${params.toString() ? `?${params.toString()}` : ""}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch sublists");
	}
	return response.json();
};

const createSublist = async (data: {
	name: string;
	description: string;
	contributorIds: string[];
}): Promise<ContributorSublist> => {
	const response = await fetch("/api/contributor-sublists", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error("Failed to create sublist");
	}
	return response.json();
};

const deleteSublist = async (id: string): Promise<{ success: boolean }> => {
	const response = await fetch(`/api/contributor-sublists/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		throw new Error("Failed to delete sublist");
	}
	return response.json();
};

export default function ContributorSublistsPage() {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	// State for UI
	const [searchQuery, setSearchQuery] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [newSublistName, setNewSublistName] = useState("");
	const [newSublistDescription, setNewSublistDescription] = useState("");
	const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
	const [importMode, setImportMode] = useState<"manual" | "import">("manual");
	const [githubHandles, setGithubHandles] = useState("");
	const [importError, setImportError] = useState("");
	const [importSuccess, setImportSuccess] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof ContributorSublist | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });

	// Create debounced search function with lodash
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSearch = useCallback(
		debounce((value: string) => {
			setSearchQuery(value);
		}, 300),
		[]
	);

	// Cleanup debounced function on unmount
	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	// Queries
	const {
		data: contributors = [],
		isLoading: isLoadingContributors,
		error: contributorsError,
	} = useQuery({
		queryKey: ["contributors"],
		queryFn: fetchContributors,
	});

	const {
		data: sublists = [],
		isLoading: isLoadingSublists,
		error: sublistsError,
	} = useQuery({
		queryKey: ["sublists", searchQuery, sortConfig.key, sortConfig.direction],
		queryFn: () =>
			fetchSublists({
				search: searchQuery,
				sort: sortConfig.key
					? {
							key: sortConfig.key,
							direction: sortConfig.direction,
					  }
					: undefined,
			}),
		// Debounce search queries to avoid excessive API calls
		refetchOnWindowFocus: false,
	});

	// Mutations
	const createSublistMutation = useMutation({
		mutationFn: createSublist,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["sublists"] });

			// Reset form
			setNewSublistName("");
			setNewSublistDescription("");
			setSelectedContributorIds([]);
			setGithubHandles("");
			setImportMode("manual");
			setImportError("");
			setImportSuccess("");
			setIsCreating(false);

			toast({
				title: "Success",
				description: "Contributor sublist created successfully",
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: `Failed to create sublist: ${error.message}`,
				variant: "destructive",
			});
		},
	});

	const deleteSublistMutation = useMutation({
		mutationFn: deleteSublist,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sublists"] });
			toast({
				title: "Success",
				description: "Contributor sublist deleted successfully",
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: `Failed to delete sublist: ${error.message}`,
				variant: "destructive",
			});
		},
	});

	// Derived state for filtered sublists
	const filteredSublists = sublists.filter((sublist) => {
		if (searchQuery.trim() === "") return true;

		const lowercaseQuery = searchQuery.toLowerCase();
		return (
			sublist.name.toLowerCase().includes(lowercaseQuery) ||
			sublist.description.toLowerCase().includes(lowercaseQuery)
		);
	});

	const handleCreateSublist = () => {
		if (!newSublistName.trim()) return;

		createSublistMutation.mutate({
			name: newSublistName,
			description: newSublistDescription,
			contributorIds: selectedContributorIds,
		});
	};

	const handleDeleteSublist = (id: string) => {
		deleteSublistMutation.mutate(id);
	};

	const handleCheckboxChange = (contributorId: string) => {
		setSelectedContributorIds((prev) =>
			prev.includes(contributorId) ? prev.filter((id) => id !== contributorId) : [...prev, contributorId]
		);
	};

	const handleImportGithubHandles = () => {
		if (!githubHandles.trim()) {
			setImportError("Please enter GitHub handles to import");
			return;
		}

		setImportError("");
		setImportSuccess("");

		// Parse the GitHub handles (comma, space, or newline separated)
		const handles = githubHandles
			.split(/[\s,\n]+/)
			.map((handle) => handle.trim())
			.filter((handle) => handle.length > 0);

		if (handles.length === 0) {
			setImportError("No valid GitHub handles found");
			return;
		}

		// Find contributors matching the GitHub handles
		// For this mock implementation, we'll just match by name
		// In a real implementation, you would match by GitHub username
		const matchedContributors: Contributor[] = [];
		const newContributors: Contributor[] = [];

		handles.forEach((handle) => {
			// Remove @ prefix if present
			const cleanHandle = handle.startsWith("@") ? handle.substring(1) : handle;

			// Find contributor by name (in a real app, match by GitHub username)
			const contributor = contributors.find((c) => c.name.toLowerCase() === cleanHandle.toLowerCase());

			if (contributor) {
				matchedContributors.push(contributor);
			} else {
				// Create a new contributor for unmatched handle
				const newContributor: Contributor = {
					id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Generate a unique ID
					name: cleanHandle,
					avatar: `https://github.com/${cleanHandle}.png`,
					handle: cleanHandle,
					type: "One-Time",
					tenure: "Newcomer",
					description: `GitHub user ${cleanHandle}`,
					location: "",
					organizations: [],
					prMerged: 0,
					prOpened: 0,
					issuesOpened: 0,
					issuesClosed: 0,
					commits: 0,
					lastActive: new Date().toISOString().split("T")[0],
					latestCommit: {
						message: "",
						date: "",
						url: "",
					},
					socialLinks: {
						github: `https://github.com/${cleanHandle}`,
					},
					activityScore: 0,
					languages: [],
					reputationScore: 0,
					stars: 0,
					followers: 0,
				};
				newContributors.push(newContributor);
			}
		});

		// Add new contributors to the contributors list
		if (newContributors.length > 0) {
			queryClient.setQueryData(["contributors"], (oldData: Contributor[] | undefined) =>
				oldData ? [...oldData, ...newContributors] : newContributors
			);
		}

		// Update selected contributor IDs
		const newSelectedIds = [
			...selectedContributorIds,
			...matchedContributors.map((c) => c.id),
			...newContributors.map((c) => c.id),
		];

		// Remove duplicates
		setSelectedContributorIds(Array.from(new Set(newSelectedIds)));

		// Show results
		const totalAdded = matchedContributors.length + newContributors.length;
		if (totalAdded > 0) {
			setImportSuccess(`Successfully added ${totalAdded} contributor${totalAdded === 1 ? "" : "s"}`);
			if (newContributors.length > 0) {
				setImportSuccess((prev) => `${prev} (${newContributors.length} new)`);
			}
		}
	};

	// Request sorting
	const requestSort = (key: keyof ContributorSublist) => {
		let direction: "ascending" | "descending" = "ascending";

		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}

		setSortConfig({ key, direction });
		// Server-side sorting is now handled via the queryKey change
	};

	// Get sort direction indicator
	const getSortDirectionIndicator = (key: keyof ContributorSublist) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === "ascending" ? " ↑" : " ↓";
	};

	// No need for client-side sorting anymore since API handles it
	const sortedSublists = sublists;

	// Loading and error states
	const isLoading = isLoadingContributors || isLoadingSublists;
	const error = contributorsError || sublistsError;

	if (error) {
		return (
			<div className="container mx-auto py-6">
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
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Contributor Sublists</h1>
				<Dialog open={isCreating} onOpenChange={setIsCreating}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create Sublist
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Create New Contributor Sublist</DialogTitle>
							<DialogDescription>
								Create a new sublist of contributors to track their activities and retention.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="name"
									value={newSublistName}
									onChange={(e) => setNewSublistName(e.target.value)}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="description" className="text-right">
									Description
								</Label>
								<Textarea
									id="description"
									value={newSublistDescription}
									onChange={(e) => setNewSublistDescription(e.target.value)}
									className="col-span-3"
								/>
							</div>

							<Tabs
								value={importMode}
								onValueChange={(value) => setImportMode(value as "manual" | "import")}
							>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right">Contributors</Label>
									<div className="col-span-3">
										<TabsList className="w-full">
											<TabsTrigger value="manual" className="flex-1">
												Manual Selection
											</TabsTrigger>
											<TabsTrigger value="import" className="flex-1">
												Import GitHub Handles
											</TabsTrigger>
										</TabsList>
									</div>
								</div>

								<TabsContent value="manual">
									<div className="grid grid-cols-4 gap-4">
										<div className="col-start-2 col-span-3 border rounded-md p-4 max-h-[200px] overflow-y-auto">
											{isLoadingContributors ? (
												<div className="flex items-center justify-center p-4">
													<Loader2 className="h-4 w-4 animate-spin mr-2" />
													<span>Loading contributors...</span>
												</div>
											) : (
												contributors.map((contributor) => (
													<div
														key={contributor.id}
														className="flex items-center space-x-2 mb-2"
													>
														<Checkbox
															id={`contributor-${contributor.id}`}
															checked={selectedContributorIds.includes(contributor.id)}
															onCheckedChange={() => handleCheckboxChange(contributor.id)}
														/>
														<Label
															htmlFor={`contributor-${contributor.id}`}
															className="cursor-pointer"
														>
															{contributor.name}
														</Label>
													</div>
												))
											)}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="import">
									<div className="grid grid-cols-4 gap-4">
										<div className="col-start-2 col-span-3">
											<Textarea
												placeholder="Enter GitHub handles separated by commas, spaces, or new lines (e.g., alice, @bob, carol)"
												value={githubHandles}
												onChange={(e) => setGithubHandles(e.target.value)}
												className="mb-2 h-24"
											/>
											<Button
												onClick={handleImportGithubHandles}
												className="mb-2"
												disabled={isLoadingContributors}
											>
												{isLoadingContributors ? (
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												) : (
													<Import className="mr-2 h-4 w-4" />
												)}
												Import Handles
											</Button>

											{importError && (
												<Alert variant="destructive" className="mb-2">
													<AlertCircle className="h-4 w-4" />
													<AlertDescription>{importError}</AlertDescription>
												</Alert>
											)}

											{importSuccess && (
												<Alert className="mb-2">
													<AlertDescription>{importSuccess}</AlertDescription>
												</Alert>
											)}

											{selectedContributorIds.length > 0 && (
												<div className="mt-4">
													<Label className="mb-2 block">
														Selected Contributors ({selectedContributorIds.length})
													</Label>
													<div className="border rounded-md p-4 max-h-[100px] overflow-y-auto">
														{contributors
															.filter((c) => selectedContributorIds.includes(c.id))
															.map((contributor) => (
																<div
																	key={contributor.id}
																	className="flex items-center justify-between mb-1"
																>
																	<span>{contributor.name}</span>
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() =>
																			handleCheckboxChange(contributor.id)
																		}
																	>
																		Remove
																	</Button>
																</div>
															))}
													</div>
												</div>
											)}
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsCreating(false)}>
								Cancel
							</Button>
							<Button onClick={handleCreateSublist} disabled={createSublistMutation.isPending}>
								{createSublistMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create Sublist"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<Separator className="mb-6" />

			<Card className="w-full max-w-full">
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<CardTitle>Contributor Sublists</CardTitle>
							<CardDescription>
								Manage your contributor sublists to track specific groups of contributors.
							</CardDescription>
						</div>
						<div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
							<div className="relative w-full md:w-64">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search sublists..."
									className="pl-8"
									value={inputValue}
									onChange={(e) => {
										setInputValue(e.target.value);
										debouncedSearch(e.target.value);
									}}
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin mr-2" />
							<span>Loading sublists...</span>
						</div>
					) : sublists.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12">
							<Users className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-xl font-medium mb-2">No Sublists Found</h3>
							<p className="text-muted-foreground mb-6 text-center">
								{searchQuery
									? "No sublists match your search criteria."
									: "Create your first sublist to start tracking specific groups of contributors."}
							</p>
							{!searchQuery && (
								<Button onClick={() => setIsCreating(true)}>
									<Plus className="mr-2 h-4 w-4" />
									Create Sublist
								</Button>
							)}
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
												Name{getSortDirectionIndicator("name")}
											</button>
										</TableHead>
										<TableHead>
											<button
												className="flex items-center font-medium text-left"
												onClick={() => requestSort("description")}
											>
												Description{getSortDirectionIndicator("description")}
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("contributorIds")}
											>
												<Users className="h-4 w-4" />
												<span>Contributors{getSortDirectionIndicator("contributorIds")}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("createdAt")}
											>
												Created{getSortDirectionIndicator("createdAt")}
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort("updatedAt")}
											>
												Updated{getSortDirectionIndicator("updatedAt")}
											</button>
										</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sortedSublists.map((sublist) => (
										<TableRow key={sublist.id}>
											<TableCell className="font-medium">{sublist.name}</TableCell>
											<TableCell>{sublist.description}</TableCell>
											<TableCell className="text-center">
												{sublist.contributorIds.length}
											</TableCell>
											<TableCell className="text-center">
												{formatDate(sublist.createdAt)}
											</TableCell>
											<TableCell className="text-center">
												{formatDate(sublist.updatedAt)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteSublist(sublist.id);
														}}
														disabled={deleteSublistMutation.isPending}
													>
														{deleteSublistMutation.isPending &&
														deleteSublistMutation.variables === sublist.id ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<Trash2 className="h-4 w-4" />
														)}
													</Button>
													<Link href={`/contributors/sublists/${sublist.id}`}>
														<Button variant="ghost" size="icon">
															<ChevronRight className="h-4 w-4" />
														</Button>
													</Link>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
