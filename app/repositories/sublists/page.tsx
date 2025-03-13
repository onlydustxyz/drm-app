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
import {
	RepositorySublist,
	createRepositorySublist,
	deleteRepositorySublist,
	getRepositorySublists,
} from "@/lib/services/repository-sublists-service";
import { Repository, getRepositories } from "@/lib/services/repositories-service";
import { formatDate } from "@/lib/utils";
import { AlertCircle, ChevronRight, Import, Plus, Search, Trash2, GitBranch } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RepositorySublistsPage() {
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [sublists, setSublists] = useState<RepositorySublist[]>([]);
	const [filteredSublists, setFilteredSublists] = useState<RepositorySublist[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [newSublistName, setNewSublistName] = useState("");
	const [newSublistDescription, setNewSublistDescription] = useState("");
	const [selectedRepositoryIds, setSelectedRepositoryIds] = useState<string[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof RepositorySublist | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "descending" });

	// Fetch repositories and sublists data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [repositoriesData, sublistsData] = await Promise.all([
					getRepositories(),
					getRepositorySublists(),
				]);
				setRepositories(repositoriesData);
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
		const filtered = sublists.filter(
			(sublist) =>
				sublist.name.toLowerCase().includes(lowercaseQuery) ||
				sublist.description.toLowerCase().includes(lowercaseQuery)
		);

		setFilteredSublists(filtered);
	}, [searchQuery, sublists]);

	const handleCreateSublist = async () => {
		if (!newSublistName.trim()) return;

		try {
			const newSublist = await createRepositorySublist({
				name: newSublistName,
				description: newSublistDescription,
				repositoryIds: selectedRepositoryIds,
			});

			const updatedSublists = [...sublists, newSublist];
			setSublists(updatedSublists);
			setFilteredSublists(updatedSublists);
			setNewSublistName("");
			setNewSublistDescription("");
			setSelectedRepositoryIds([]);
			setIsCreating(false);
		} catch (error) {
			console.error("Error creating sublist:", error);
		}
	};

	const handleDeleteSublist = async (id: string) => {
		try {
			const success = await deleteRepositorySublist(id);

			if (success) {
				const updatedSublists = sublists.filter((s) => s.id !== id);
				setSublists(updatedSublists);
				setFilteredSublists(updatedSublists);
			}
		} catch (error) {
			console.error("Error deleting sublist:", error);
		}
	};

	const handleCheckboxChange = (repositoryId: string) => {
		setSelectedRepositoryIds((prev) =>
			prev.includes(repositoryId) ? prev.filter((id) => id !== repositoryId) : [...prev, repositoryId]
		);
	};

	// Handle sorting
	const requestSort = (key: keyof RepositorySublist) => {
		let direction: "ascending" | "descending" = "ascending";

		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}

		setSortConfig({ key, direction });

		const sortedData = [...filteredSublists].sort((a, b) => {
			if (a[key] < b[key]) {
				return direction === "ascending" ? -1 : 1;
			}
			if (a[key] > b[key]) {
				return direction === "ascending" ? 1 : -1;
			}
			return 0;
		});

		setFilteredSublists(sortedData);
	};

	// Get sort direction indicator
	const getSortDirectionIndicator = (key: keyof RepositorySublist) => {
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

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Repository Sublists</h1>
				<Dialog open={isCreating} onOpenChange={setIsCreating}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create Sublist
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Create New Repository Sublist</DialogTitle>
							<DialogDescription>
								Create a new sublist of repositories to track their activities and metrics.
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

							<div className="grid grid-cols-4 gap-4">
								<Label className="text-right">Repositories</Label>
								<div className="col-span-3 border rounded-md p-4 max-h-[200px] overflow-y-auto">
									{repositories.map((repository) => (
										<div key={repository.id} className="flex items-center space-x-2 mb-2">
											<Checkbox
												id={`repository-${repository.id}`}
												checked={selectedRepositoryIds.includes(repository.id)}
												onCheckedChange={() => handleCheckboxChange(repository.id)}
											/>
											<Label
												htmlFor={`repository-${repository.id}`}
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
							<Button variant="outline" onClick={() => setIsCreating(false)}>
								Cancel
							</Button>
							<Button onClick={handleCreateSublist}>Create Sublist</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<Separator className="mb-6" />

			<Card className="w-full max-w-full">
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<CardTitle>Repository Sublists</CardTitle>
							<CardDescription>
								Manage your repository sublists to track specific groups of repositories.
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
							<GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-xl font-medium mb-2">No Sublists Found</h3>
							<p className="text-muted-foreground mb-6 text-center">
								{searchQuery
									? "No sublists match your search criteria."
									: "Create your first sublist to start tracking specific groups of repositories."}
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
												onClick={() => requestSort("repositoryIds")}
											>
												<GitBranch className="h-4 w-4" />
												<span>Repositories{getSortDirectionIndicator("repositoryIds")}</span>
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
									{filteredSublists.map((sublist) => (
										<TableRow key={sublist.id}>
											<TableCell className="font-medium">{sublist.name}</TableCell>
											<TableCell>{sublist.description}</TableCell>
											<TableCell className="text-center">
												{sublist.repositoryIds.length}
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
													>
														<Trash2 className="h-4 w-4" />
													</Button>
													<Link href={`/repositories/sublists/${sublist.id}`}>
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