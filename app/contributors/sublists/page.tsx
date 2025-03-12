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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	ContributorSublist,
	createContributorSublist,
	deleteContributorSublist,
	getContributorSublists,
} from "@/lib/contributor-sublists-service";
import { Contributor, getContributors } from "@/lib/contributors-service";
import { formatDate } from "@/lib/utils";
import { AlertCircle, ChevronRight, Import, Plus, Search, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContributorSublistsPage() {
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [sublists, setSublists] = useState<ContributorSublist[]>([]);
	const [filteredSublists, setFilteredSublists] = useState<ContributorSublist[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
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
		direction: 'ascending' | 'descending';
	}>({ key: null, direction: 'descending' });

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
				setFilteredSublists(sublistsData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Apply search filter
	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredSublists(sublists);
			return;
		}
		
		const lowercaseQuery = searchQuery.toLowerCase();
		const filtered = sublists.filter((sublist) =>
			sublist.name.toLowerCase().includes(lowercaseQuery) ||
			sublist.description.toLowerCase().includes(lowercaseQuery)
		);
		
		setFilteredSublists(filtered);
	}, [searchQuery, sublists]);

	const handleCreateSublist = async () => {
		if (!newSublistName.trim()) return;
		
		try {
			const newSublist = await createContributorSublist({
				name: newSublistName,
				description: newSublistDescription,
				contributorIds: selectedContributorIds,
			});
			
			const updatedSublists = [...sublists, newSublist];
			setSublists(updatedSublists);
			setFilteredSublists(updatedSublists);
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
				const updatedSublists = sublists.filter(s => s.id !== id);
				setSublists(updatedSublists);
				setFilteredSublists(updatedSublists);
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

	// Handle sorting
	const requestSort = (key: keyof ContributorSublist) => {
		let direction: 'ascending' | 'descending' = 'ascending';
		
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		
		setSortConfig({ key, direction });
		
		const sortedData = [...filteredSublists].sort((a, b) => {
			if (a[key] < b[key]) {
				return direction === 'ascending' ? -1 : 1;
			}
			if (a[key] > b[key]) {
				return direction === 'ascending' ? 1 : -1;
			}
			return 0;
		});
		
		setFilteredSublists(sortedData);
	};

	// Get sort direction indicator
	const getSortDirectionIndicator = (key: keyof ContributorSublist) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
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
							
							<Tabs value={importMode} onValueChange={(value) => setImportMode(value as "manual" | "import")}>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right">
										Contributors
									</Label>
									<div className="col-span-3">
										<TabsList className="w-full">
											<TabsTrigger value="manual" className="flex-1">Manual Selection</TabsTrigger>
											<TabsTrigger value="import" className="flex-1">Import GitHub Handles</TabsTrigger>
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
													<Label htmlFor={`contributor-${contributor.id}`} className="cursor-pointer">
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
											<Button 
												onClick={handleImportGithubHandles}
												className="mb-2"
											>
												<Import className="mr-2 h-4 w-4" />
												Import Handles
											</Button>
											
											{importError && (
												<Alert variant="destructive" className="mb-2">
													<AlertCircle className="h-4 w-4" />
													<AlertDescription>
														{importError}
													</AlertDescription>
												</Alert>
											)}
											
											{importSuccess && (
												<Alert className="mb-2">
													<AlertDescription>
														{importSuccess}
													</AlertDescription>
												</Alert>
											)}
											
											{selectedContributorIds.length > 0 && (
												<div className="mt-4">
													<Label className="mb-2 block">Selected Contributors ({selectedContributorIds.length})</Label>
													<div className="border rounded-md p-4 max-h-[100px] overflow-y-auto">
														{contributors
															.filter(c => selectedContributorIds.includes(c.id))
															.map(contributor => (
																<div key={contributor.id} className="flex items-center justify-between mb-1">
																	<span>{contributor.name}</span>
																	<Button 
																		variant="ghost" 
																		size="sm"
																		onClick={() => handleCheckboxChange(contributor.id)}
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
							<Button onClick={handleCreateSublist}>
								Create Sublist
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
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{filteredSublists.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12">
							<Users className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-xl font-medium mb-2">No Sublists Found</h3>
							<p className="text-muted-foreground mb-6 text-center">
								{searchQuery ? "No sublists match your search criteria." : "Create your first sublist to start tracking specific groups of contributors."}
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
												onClick={() => requestSort('name')}
											>
												Name{getSortDirectionIndicator('name')}
											</button>
										</TableHead>
										<TableHead>
											<button 
												className="flex items-center font-medium text-left"
												onClick={() => requestSort('description')}
											>
												Description{getSortDirectionIndicator('description')}
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button 
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort('contributorIds')}
											>
												<Users className="h-4 w-4" />
												<span>Contributors{getSortDirectionIndicator('contributorIds')}</span>
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button 
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort('createdAt')}
											>
												Created{getSortDirectionIndicator('createdAt')}
											</button>
										</TableHead>
										<TableHead className="text-center">
											<button 
												className="flex items-center justify-center gap-1 w-full"
												onClick={() => requestSort('updatedAt')}
											>
												Updated{getSortDirectionIndicator('updatedAt')}
											</button>
										</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredSublists.map((sublist) => (
										<TableRow key={sublist.id}>
											<TableCell className="font-medium">{sublist.name}</TableCell>
											<TableCell>{sublist.description}</TableCell>
											<TableCell className="text-center">{sublist.contributorIds.length}</TableCell>
											<TableCell className="text-center">{formatDate(sublist.createdAt)}</TableCell>
											<TableCell className="text-center">{formatDate(sublist.updatedAt)}</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
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
