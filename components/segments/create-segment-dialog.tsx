"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
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
import { useCreateSegment } from "@/lib/react-query/segments";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

export function CreateSegmentDialog() {
	const [newSublistName, setNewSublistName] = useState("");
	const [newSublistDescription, setNewSublistDescription] = useState("");
	const [segmentType, setSegmentType] = useState<"repositories" | "contributors">("repositories");
	const [githubHandles, setGithubHandles] = useState("");
	const [repoUrls, setRepoUrls] = useState("");

	const createSegmentMutation = useCreateSegment();

	const handleCreateSegment = () => {
		if (!newSublistName.trim()) return;

		createSegmentMutation.mutate({
			name: newSublistName,
			description: newSublistDescription,
			contributors: 0,
			url: "",
			stars: 0,
			forks: 0,
			watchers: 0,
			languages: [],
			last_updated_at: "",
			prMerged: 0,
			prOpened: 0,
			issuesOpened: 0,
			issuesClosed: 0,
			commits: 0,
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Create New Segment
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Create New Segment</DialogTitle>
					<DialogDescription>Create a new segment to track your data.</DialogDescription>
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
						value={segmentType}
						onValueChange={(value) => setSegmentType(value as "repositories" | "contributors")}
					>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Type</Label>
							<div className="col-span-3">
								<TabsList className="w-full">
									<TabsTrigger value="repositories" className="flex-1">
										Repositories
									</TabsTrigger>
									<TabsTrigger value="contributors" className="flex-1">
										Contributors
									</TabsTrigger>
								</TabsList>
							</div>
						</div>

						<TabsContent value="repositories">
							<div className="grid grid-cols-4 gap-4">
								<div className="col-start-2 col-span-3">
									<Textarea
										placeholder="Enter repository URLs separated by commas, spaces, or new lines (e.g., https://github.com/alice/repo1, https://github.com/bob/repo2, https://github.com/carol/repo3)"
										value={repoUrls}
										onChange={(e) => setRepoUrls(e.target.value)}
										className="mb-2 h-24"
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="contributors">
							<div className="grid grid-cols-4 gap-4">
								<div className="col-start-2 col-span-3">
									<Textarea
										placeholder="Enter GitHub handles separated by commas, spaces, or new lines (e.g., alice, @bob, carol)"
										value={githubHandles}
										onChange={(e) => setGithubHandles(e.target.value)}
										className="mb-2 h-24"
									/>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>

					<Button onClick={handleCreateSegment} disabled={createSegmentMutation.isPending}>
						{createSegmentMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating...
							</>
						) : (
							"Create Segment"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
