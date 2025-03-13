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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	RepositorySublist,
	getRepositorySublist,
	updateRepositorySublist,
	getRepositoryActivityData,
	getRepositoryRetentionData,
	RepositoryRetention
} from "@/lib/services/repository-sublists-service";
import { Repository, getRepositories } from "@/lib/services/repositories-service";
import { formatDate } from "@/lib/utils";
import {
	Activity,
	BarChart3,
	ChevronLeft,
	Edit,
	GitBranch,
	GitCommit,
	GitPullRequest,
	GitPullRequestClosed,
	MessageSquare,
	Star,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { GitHubActivityGraph } from "@/components/charts/github-activity-graph";
import { RetentionBarChart } from "@/components/charts/retention-chart";
import { ContributorActivity } from "@/components/charts/github-activity-graph";

export default function SublistDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const { id: sublistId } = use(params);
	const [sublist, setSublist] = useState<RepositorySublist | null>(null);
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [newSublistName, setNewSublistName] = useState("");
	const [newSublistDescription, setNewSublistDescription] = useState("");
	const [selectedRepositoryIds, setSelectedRepositoryIds] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState("overview");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Repository | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });
	const [retentionData, setRetentionData] = useState<RepositoryRetention[]>([]);
	const [activityData, setActivityData] = useState<ContributorActivity[]>([]);

	// Fetch sublist and repositories data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Fetch sublist data
				const sublistData = await getRepositorySublist(sublistId);
				if (!sublistData) {
					// Sublist not found, redirect to sublists page
					router.push("/repositories/sublists");
					return;
				}

				console.log("Sublist data:", sublistData);

				setSublist(sublistData);
				setNewSublistName(sublistData.name);
				setNewSublistDescription(sublistData.description);
				setSelectedRepositoryIds([...sublistData.repositoryIds]);

				// Fetch repositories data
				const repositoriesData = await getRepositories();

				console.log("All repositories:", repositoriesData);
				console.log("Repository IDs in sublist:", sublistData.repositoryIds);

				// Make sure we're comparing strings to strings for IDs
				const filteredRepos = repositoriesData.filter((r: Repository) =>
					sublistData.repositoryIds.includes(String(r.id))
				);

				console.log("Filtered repositories:", filteredRepos);

				setRepositories(repositoriesData);
				setFilteredRepositories(filteredRepos);
				
				// Fetch activity and retention data
				try {
					const activityData = await getRepositoryActivityData(sublistId);
					const retentionData = await getRepositoryRetentionData(sublistId);
					setActivityData(activityData);
					setRetentionData(retentionData);
				} catch (error) {
					console.error("Error fetching activity/retention data:", error);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [sublistId, router]);

	const handleUpdateSublist = async () => {
		if (!newSublistName.trim() || !sublist) return;

		try {
			const updatedSublist = await updateRepositorySublist(sublistId, {
				name: newSublistName,
				description: newSublistDescription,
				repositoryIds: selectedRepositoryIds,
			});

			if (updatedSublist) {
				setSublist(updatedSublist);
				
				// Update filtered repositories
				const updatedFilteredRepos = repositories.filter((r) =>
					updatedSublist.repositoryIds.includes(String(r.id))
				);
				setFilteredRepositories(updatedFilteredRepos);
			}

			setIsEditing(false);
		} catch (error) {
			console.error("Error updating sublist:", error);
		}
	};

	const handleCheckboxChange = (repositoryId: string) => {
		setSelectedRepositoryIds((prev) =>
			prev.includes(repositoryId) ? prev.filter((id) => id !== repositoryId) : [...prev, repositoryId]
		);
	};

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

	if (isLoading || !sublist) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center gap-2 mb-6">
				<Link href="/repositories/sublists">
					<Button variant="outline" size="icon">
						<ChevronLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h1 className="text-3xl font-bold">{sublist.name}</h1>
				<Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
					<Edit className="h-4 w-4" />
				</Button>
			</div>

			<p className="text-muted-foreground mb-6">{sublist.description}</p>
			<Separator className="mb-6" />

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle>{sublist.name}</CardTitle>
							<CardDescription>{sublist.description}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-muted-foreground mb-4">
						<span className="font-medium">Created:</span> {formatDate(sublist.createdAt)} |
						<span className="font-medium ml-2">Last Updated:</span> {formatDate(sublist.updatedAt)} |
						<span className="font-medium ml-2">Repositories:</span> {sublist.repositoryIds.length}
					</div>

					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="mb-4">
							<TabsTrigger value="overview">
								<GitBranch className="h-4 w-4 mr-2" />
								Repositories
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
													<span>Issues Opened{getSortDirectionIndicator("issuesOpened")}</span>
												</button>
											</TableHead>
											<TableHead className="text-center">
												<button
													className="flex items-center justify-center gap-1 w-full"
													onClick={() => requestSort("issuesClosed")}
												>
													<MessageSquare className="h-4 w-4" />
													<span>Issues Closed{getSortDirectionIndicator("issuesClosed")}</span>
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
													<Star className="h-4 w-4" />
													<span>Stars{getSortDirectionIndicator("stars")}</span>
												</button>
											</TableHead>
											<TableHead className="text-right">
												<button
													className="flex items-center justify-end gap-1 w-full"
													onClick={() => requestSort("last_updated_at")}
												>
													Updated{getSortDirectionIndicator("last_updated_at")}
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
											filteredRepositories.map((repository) => (
												<TableRow key={repository.id}>
													<TableCell className="font-medium">
														<div className="flex flex-col">
															<a
																href={repository.url || ""}
																className="hover:underline text-primary"
																target="_blank"
																rel="noopener noreferrer"
															>
																{repository.name}
															</a>
															<span className="text-xs text-muted-foreground mt-1">
																{repository.description}
															</span>
														</div>
													</TableCell>
													<TableCell className="text-center">{repository.prMerged}</TableCell>
													<TableCell className="text-center">{repository.prOpened}</TableCell>
													<TableCell className="text-center">{repository.issuesOpened}</TableCell>
													<TableCell className="text-center">{repository.issuesClosed}</TableCell>
													<TableCell className="text-center">{repository.commits}</TableCell>
													<TableCell className="text-center">{repository.contributors}</TableCell>
													<TableCell className="text-center">{repository.stars}</TableCell>
													<TableCell className="text-right">
														{formatDate(repository.last_updated_at)}
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
								<h2 className="text-xl font-semibold mb-4">Repository Activity</h2>
								<p className="text-sm text-muted-foreground mb-6">
									GitHub-style activity graph showing contributions by repositories
								</p>
								<GitHubActivityGraph data={activityData} />
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Edit Repository Sublist</DialogTitle>
						<DialogDescription>
							Update the details and repositories in this sublist.
						</DialogDescription>
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

						<div className="grid grid-cols-4 gap-4">
							<Label className="text-right">Repositories</Label>
							<div className="col-span-3 border rounded-md p-4 max-h-[200px] overflow-y-auto">
								{repositories.map((repository) => (
									<div key={repository.id} className="flex items-center space-x-2 mb-2">
										<Checkbox
											id={`edit-repository-${repository.id}`}
											checked={selectedRepositoryIds.includes(repository.id)}
											onCheckedChange={() => handleCheckboxChange(repository.id)}
										/>
										<Label
											htmlFor={`edit-repository-${repository.id}`}
											className="cursor-pointer"
										>
											{repository.name}
										</Label>
									</div>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditing(false)}>
							Cancel
						</Button>
						<Button onClick={handleUpdateSublist}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
} 