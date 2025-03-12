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
import {
	ContributorSublist,
	getContributorActivityData,
	getContributorRetentionData,
	getContributorSublist,
	updateContributorSublist,
} from "@/lib/services/contributor-sublists-service";
import { Contributor, getContributors } from "@/lib/services/contributors-service";
import { formatDate } from "@/lib/utils";
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
	MessageSquare,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function SublistDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const { id: sublistId } = use(params);
	const [sublist, setSublist] = useState<ContributorSublist | null>(null);
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [filteredContributors, setFilteredContributors] = useState<Contributor[]>([]);
	const [retentionData, setRetentionData] = useState<any[]>([]);
	const [activityData, setActivityData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [newSublistName, setNewSublistName] = useState("");
	const [newSublistDescription, setNewSublistDescription] = useState("");
	const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState("overview");
	const [importMode, setImportMode] = useState<"manual" | "import">("manual");
	const [githubHandles, setGithubHandles] = useState("");
	const [importError, setImportError] = useState("");
	const [importSuccess, setImportSuccess] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Contributor | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });

	// Fetch sublist and contributors data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Fetch sublist data
				const sublistData = await getContributorSublist(sublistId);
				if (!sublistData) {
					// Sublist not found, redirect to sublists page
					router.push("/contributors/sublists");
					return;
				}

				console.log("Sublist data:", sublistData);

				setSublist(sublistData);
				setNewSublistName(sublistData.name);
				setNewSublistDescription(sublistData.description);
				setSelectedContributorIds([...sublistData.contributorIds]);

				// Fetch contributors, retention data, and activity data
				const [contributorsData, retentionData, activityData] = await Promise.all([
					getContributors(),
					getContributorRetentionData(sublistData.contributorIds),
					getContributorActivityData(sublistData.contributorIds),
				]);

				console.log("All contributors:", contributorsData);
				console.log("Contributor IDs in sublist:", sublistData.contributorIds);

				// Make sure we're comparing strings to strings for IDs
				const filteredContribs = contributorsData.filter((c: Contributor) =>
					sublistData.contributorIds.includes(String(c.id))
				);

				console.log("Filtered contributors:", filteredContribs);

				setContributors(contributorsData);
				setFilteredContributors(filteredContribs);
				setRetentionData(retentionData);
				setActivityData(activityData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [sublistId, router]);

	const handleUpdateSublist = async () => {
		if (!sublist || !newSublistName.trim()) return;

		try {
			const updatedSublist = await updateContributorSublist(sublist.id, {
				name: newSublistName,
				description: newSublistDescription,
				contributorIds: selectedContributorIds,
			});

			if (updatedSublist) {
				setSublist(updatedSublist);
				// Make sure we're comparing strings to strings for IDs
				setFilteredContributors(
					contributors.filter((c) => updatedSublist.contributorIds.includes(String(c.id)))
				);
				setIsEditing(false);
				setImportMode("manual");
				setGithubHandles("");
				setImportError("");
				setImportSuccess("");

				// Update retention data and activity data
				const [retentionData, activityData] = await Promise.all([
					getContributorRetentionData(updatedSublist.contributorIds),
					getContributorActivityData(updatedSublist.contributorIds),
				]);

				setRetentionData(retentionData);
				setActivityData(activityData);
			}
		} catch (error) {
			console.error("Error updating sublist:", error);
		}
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
			setContributors((prevContributors) => [...prevContributors, ...newContributors]);
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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-lg">Loading...</div>
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

			{/* Debug information */}
			{process.env.NODE_ENV !== "production" && (
				<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
					<h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Information</h3>
					<div className="text-xs text-yellow-700 space-y-1">
						<p>Sublist ID: {sublist.id}</p>
						<p>Contributor IDs: {sublist.contributorIds.join(", ")}</p>
						<p>Filtered Contributors Count: {filteredContributors.length}</p>
						<p>All Contributors Count: {contributors.length}</p>
					</div>
				</div>
			)}

			<Card className="mb-6">
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle>{sublist.name}</CardTitle>
							<CardDescription>{sublist.description}</CardDescription>
						</div>
						<Dialog open={isEditing} onOpenChange={setIsEditing}>
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
													{contributors.map((contributor) => (
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
													))}
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
													<Button onClick={handleImportGithubHandles} className="mb-2">
														<Import className="mr-2 h-4 w-4" />
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
									<Button onClick={handleUpdateSublist}>Update Sublist</Button>
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
