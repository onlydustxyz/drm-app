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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	ContributorSublist,
	createContributorSublist,
	deleteContributorSublist,
	getContributorSublists,
} from "@/lib/contributor-sublists-service";
import { Contributor, getContributors } from "@/lib/contributors-service";
import { formatDate } from "@/lib/utils";
import { AlertCircle, ChevronRight, Import, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContributorSublistsPage() {
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [sublists, setSublists] = useState<ContributorSublist[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [newSublistName, setNewSublistName] = useState("");
	const [newSublistDescription, setNewSublistDescription] = useState("");
	const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
	const [importMode, setImportMode] = useState<"manual" | "import">("manual");
	const [githubHandles, setGithubHandles] = useState("");
	const [importError, setImportError] = useState("");
	const [importSuccess, setImportSuccess] = useState("");

	// Fetch contributors and sublists data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [contributorsData, sublistsData] = await Promise.all([
					getContributors(),
					getContributorSublists(),
				]);
				setContributors(contributorsData);
				setSublists(sublistsData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCreateSublist = async () => {
		if (!newSublistName.trim()) return;

		try {
			const newSublist = await createContributorSublist({
				name: newSublistName,
				description: newSublistDescription,
				contributorIds: selectedContributorIds,
			});

			setSublists([...sublists, newSublist]);
			setNewSublistName("");
			setNewSublistDescription("");
			setSelectedContributorIds([]);
			setGithubHandles("");
			setImportMode("manual");
			setImportError("");
			setImportSuccess("");
			setIsCreating(false);
		} catch (error) {
			console.error("Error creating sublist:", error);
		}
	};

	const handleDeleteSublist = async (id: string) => {
		try {
			const success = await deleteContributorSublist(id);

			if (success) {
				const updatedSublists = sublists.filter((s) => s.id !== id);
				setSublists(updatedSublists);
			}
		} catch (error) {
			console.error("Error deleting sublist:", error);
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
					prMerged: 0,
					prOpened: 0,
					issuesOpened: 0,
					issuesClosed: 0,
					commits: 0,
					lastActive: new Date().toISOString().split("T")[0],
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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-lg">Loading...</div>
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
											{contributors.map((contributor) => (
												<div key={contributor.id} className="flex items-center space-x-2 mb-2">
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
							<Button onClick={handleCreateSublist}>Create Sublist</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sublists.length === 0 ? (
					<div className="col-span-full">
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Users className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-xl font-medium mb-2">No Sublists Created</h3>
								<p className="text-muted-foreground mb-6 text-center">
									Create your first sublist to start tracking specific groups of contributors.
								</p>
								<Button onClick={() => setIsCreating(true)}>
									<Plus className="mr-2 h-4 w-4" />
									Create Sublist
								</Button>
							</CardContent>
						</Card>
					</div>
				) : (
					sublists.map((sublist) => (
						<Card key={sublist.id} className="hover:shadow-md transition-shadow">
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle>{sublist.name}</CardTitle>
										<CardDescription>{sublist.description}</CardDescription>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteSublist(sublist.id);
										}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground mb-4">
									<span className="font-medium">Created:</span> {formatDate(sublist.createdAt)} |
									<span className="font-medium ml-2">Contributors:</span>{" "}
									{sublist.contributorIds.length}
								</div>
								<Link href={`/contributors/sublists/${sublist.id}`}>
									<Button className="w-full">
										View Details
										<ChevronRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
