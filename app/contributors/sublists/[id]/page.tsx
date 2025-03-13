"use client";

import { GitHubActivityGraph } from "@/components/charts/github-activity-graph";
import { RetentionBarChart } from "@/components/charts/retention-chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ContributorSublist } from "@/lib/services/contributor-sublists-service";
import { Contributor } from "@/lib/services/contributors-service";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Activity,
	AlertCircle,
	BarChart3,
	ChevronLeft,
	Edit,
	GitBranch,
	GitCommit,
	GitPullRequest,
	GitPullRequestClosed,
	Import,
	Loader2,
	MessageSquare,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// API fetch functions
const fetchSublist = async (id: string): Promise<ContributorSublist> => {
	const response = await fetch(`/api/contributor-sublists/${id}`);
	if (!response.ok) {
		throw new Error("Failed to fetch sublist");
	}
	return response.json();
};

const fetchContributors = async (): Promise<Contributor[]> => {
	const response = await fetch("/api/contributors");
	if (!response.ok) {
		throw new Error("Failed to fetch contributors");
	}
	return response.json();
};

const fetchRetentionData = async (contributorIds: string[]): Promise<any[]> => {
	const params = new URLSearchParams();
	contributorIds.forEach((id) => params.append("contributorIds[]", id));
	const response = await fetch(`/api/contributor-retention?${params.toString()}`);
	if (!response.ok) {
		throw new Error("Failed to fetch retention data");
	}
	return response.json();
};

const fetchActivityData = async (contributorIds: string[]): Promise<any[]> => {
	const params = new URLSearchParams();
	contributorIds.forEach((id) => params.append("contributorIds[]", id));
	const response = await fetch(`/api/contributor-activity?${params.toString()}`);
	if (!response.ok) {
		throw new Error("Failed to fetch activity data");
	}
	return response.json();
};

const updateSublist = async (data: {
	id: string;
	name: string;
	description: string;
	contributorIds: string[];
}): Promise<ContributorSublist> => {
	const response = await fetch(`/api/contributor-sublists/${data.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error("Failed to update sublist");
	}
	return response.json();
};

export default function SublistDetailPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const sublistId = params.id;

	// State for UI
	const [isEditing, setIsEditing] = useState(false);
	const [newSublistName, setNewSublistName] = useState("");
	const [newSublistDescription, setNewSublistDescription] = useState("");
	const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState("overview");
	const [importMode, setImportMode] = useState<"manual" | "import">("manual");
	const [githubHandles, setGithubHandles] = useState("");
	const [importError, setImportError] = useState("");
	const [importSuccess, setImportSuccess] = useState("");
	const [filteredContributors, setFilteredContributors] = useState<Contributor[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Contributor | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });

	// Queries
	const {
		data: sublist = {} as ContributorSublist,
		isLoading: isLoadingSublist,
		error: sublistError,
	} = useQuery({
		queryKey: ["sublist", sublistId],
		queryFn: () => fetchSublist(sublistId),
	});

	// Handle sublist data loaded
	useEffect(() => {
		if (sublist && sublist.name) {
			setNewSublistName(sublist.name);
			setNewSublistDescription(sublist.description || "");
			setSelectedContributorIds([...sublist.contributorIds]);
		}
	}, [sublist]);

	const {
		data: contributors = [],
		isLoading: isLoadingContributors,
		error: contributorsError,
	} = useQuery({
		queryKey: ["contributors"],
		queryFn: fetchContributors,
	});

	// Update filtered contributors whenever the sublist or contributors change
	useEffect(() => {
		if (sublist && sublist.contributorIds && contributors.length > 0) {
			const filtered = contributors.filter((c) => sublist.contributorIds.includes(String(c.id)));
			setFilteredContributors(filtered);
		}
	}, [sublist, contributors]);

	const {
		data: retentionData = [],
		isLoading: isLoadingRetention,
		error: retentionError,
	} = useQuery({
		queryKey: ["retention", sublist?.contributorIds],
		queryFn: () => fetchRetentionData(sublist?.contributorIds || []),
		enabled: !!sublist?.contributorIds?.length,
	});

	const {
		data: activityData = [],
		isLoading: isLoadingActivity,
		error: activityError,
	} = useQuery({
		queryKey: ["activity", sublist?.contributorIds],
		queryFn: () => fetchActivityData(sublist?.contributorIds || []),
		enabled: !!sublist?.contributorIds?.length,
	});

	// Mutations
	const updateSublistMutation = useMutation({
		mutationFn: updateSublist,
		onSuccess: (updatedSublist) => {
			// Invalidate and refetch relevant queries
			queryClient.invalidateQueries({ queryKey: ["sublist", sublistId] });
			queryClient.invalidateQueries({ queryKey: ["retention", updatedSublist.contributorIds] });
			queryClient.invalidateQueries({ queryKey: ["activity", updatedSublist.contributorIds] });

			// Reset form state
			setIsEditing(false);
			setImportMode("manual");
			setGithubHandles("");
			setImportError("");
			setImportSuccess("");

			toast({
				title: "Success",
				description: "Contributor sublist updated successfully",
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: `Failed to update sublist: ${error.message}`,
				variant: "destructive",
			});
		},
	});

	const handleUpdateSublist = () => {
		if (!sublist || !newSublistName.trim()) return;

		updateSublistMutation.mutate({
			id: sublist.id,
			name: newSublistName,
			description: newSublistDescription,
			contributorIds: selectedContributorIds,
		});
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

	// Request sort
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

	// Combine all loading states
	const isLoading = isLoadingSublist || isLoadingContributors || isLoadingRetention || isLoadingActivity;

	// Combine all error states
	const error = sublistError || contributorsError || retentionError || activityError;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin mr-2" />
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-6">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						{error instanceof Error ? error.message : "An unknown error occurred"}
					</AlertDescription>
				</Alert>
				<div className="mt-4">
					<Link href="/contributors/sublists">
						<Button>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back to Sublists
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	if (!sublist) {
		return (
			<div className="container mx-auto py-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Sublist Not Found</h1>
					<p className="mb-6">The requested sublist could not be found.</p>
					<Link href="/contributors/sublists">
						<Button>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back to Sublists
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center mb-6">
				<Link href="/contributors/sublists">
					<Button variant="outline" size="sm">
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back to Sublists
					</Button>
				</Link>
				<h1 className="text-3xl font-bold ml-4">{sublist.name}</h1>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle>{sublist.name}</CardTitle>
							<CardDescription>{sublist.description}</CardDescription>
						</div>
						<Dialog
							open={isEditing}
							onOpenChange={(open) => {
								if (open && sublist) {
									// Ensure form is populated with current values when dialog opens
									setNewSublistName(sublist.name);
									setNewSublistDescription(sublist.description);
									setSelectedContributorIds([...sublist.contributorIds]);
									setImportMode("manual");
									setImportError("");
									setImportSuccess("");
								}
								setIsEditing(open);
							}}
						>
							<DialogTrigger asChild>
								<Button variant="outline">
									<Edit className="mr-2 h-4 w-4" />
									Edit Sublist
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[600px]">
								<DialogHeader>
									<DialogTitle>Edit Contributor Sublist</DialogTitle>
									<DialogDescription>Update the sublist details and contributors.</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="edit-name" className="text-right">
											Name
										</Label>
										<Input
											id="edit-name"
											value={newSublistName}
											onChange={(e) => setNewSublistName(e.target.value)}
											className="col-span-3"
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="edit-description" className="text-right">
											Description
										</Label>
										<Textarea
											id="edit-description"
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
																	id={`edit-contributor-${contributor.id}`}
																	checked={selectedContributorIds.includes(
																		contributor.id
																	)}
																	onCheckedChange={() =>
																		handleCheckboxChange(contributor.id)
																	}
																/>
																<Label
																	htmlFor={`edit-contributor-${contributor.id}`}
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
																	.filter((c) =>
																		selectedContributorIds.includes(c.id)
																	)
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
									<Button variant="outline" onClick={() => setIsEditing(false)}>
										Cancel
									</Button>
									<Button onClick={handleUpdateSublist} disabled={updateSublistMutation.isPending}>
										{updateSublistMutation.isPending ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Updating...
											</>
										) : (
											"Update Sublist"
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-muted-foreground mb-4">
						<span className="font-medium">Created:</span> {formatDate(sublist.createdAt)} |
						<span className="font-medium ml-2">Last Updated:</span> {formatDate(sublist.updatedAt)} |
						<span className="font-medium ml-2">Contributors:</span> {sublist.contributorIds.length}
					</div>

					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="mb-4">
							<TabsTrigger value="overview">
								<Users className="h-4 w-4 mr-2" />
								Contributors
							</TabsTrigger>
							<TabsTrigger value="activity">
								<Activity className="h-4 w-4 mr-2" />
								Activity
							</TabsTrigger>
							<TabsTrigger value="retention">
								<BarChart3 className="h-4 w-4 mr-2" />
								Retention
							</TabsTrigger>
						</TabsList>

						<TabsContent value="overview">
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
												<TableCell colSpan={7} className="h-24 text-center">
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
													<TableCell className="text-center">
														{contributor.prMerged}
													</TableCell>
													<TableCell className="text-center">
														{contributor.prOpened}
													</TableCell>
													<TableCell className="text-center">
														{contributor.issuesOpened}
													</TableCell>
													<TableCell className="text-center">
														{contributor.issuesClosed}
													</TableCell>
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
						</TabsContent>

						<TabsContent value="activity">
							<div className="grid grid-cols-2 gap-6">
								<Card>
									<CardHeader>
										<CardTitle>Pull Requests</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-[300px]">
											<RetentionBarChart data={retentionData} />
										</div>
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Commits</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-[300px]">
											<RetentionBarChart data={retentionData} />
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="retention">
							<div>
								<h2 className="text-xl font-semibold mb-4">Contributor Activity</h2>
								<p className="text-sm text-muted-foreground mb-6">
									GitHub-style activity graph showing PR contributions by contributors and projects
								</p>
								<GitHubActivityGraph data={activityData} />
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
