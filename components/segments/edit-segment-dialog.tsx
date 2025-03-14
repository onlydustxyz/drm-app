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
import { useUpdateSegment } from "@/lib/react-query/segments";
import { Segment } from "@/lib/services/segments-service";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Parses and normalizes a repository URL
 * @param url GitHub URL or "owner/repo" format string
 * @returns Normalized repository URL
 */
function parseRepositoryUrl(url: string): string {
	// Trim the URL and remove any trailing .git
	const trimmedUrl = url.trim().replace(/\.git$/, "");

	// If it's already a GitHub URL, return it as is
	if (trimmedUrl.match(/^https?:\/\/github\.com\/[^\/]+\/[^\/]+/i)) {
		return trimmedUrl;
	}

	// If it's in the format "owner/repo", convert to a GitHub URL
	if (/^[^\/]+\/[^\/]+$/.test(trimmedUrl)) {
		return `https://github.com/${trimmedUrl}`;
	}

	// Return the original string if it doesn't match any pattern
	return trimmedUrl;
}

interface EditSegmentDialogProps {
	segment: Segment;
	children?: React.ReactNode;
}

export function EditSegmentDialog({ segment, children }: EditSegmentDialogProps) {
	const [segmentName, setSegmentName] = useState("");
	const [segmentDescription, setSegmentDescription] = useState("");
	const [segmentType, setSegmentType] = useState<"repositories" | "contributors">("repositories");
	const [githubHandles, setGithubHandles] = useState("");
	const [repoUrls, setRepoUrls] = useState("");
	const [open, setOpen] = useState(false);

	// Initialize form with segment data when the segment changes or dialog opens
	useEffect(() => {
		if (segment && open) {
			setSegmentName(segment.name);
			setSegmentDescription(segment.description || "");

			// Determine segment type based on what's populated
			if (segment.github_user_logins && segment.github_user_logins.length > 0) {
				setSegmentType("contributors");
				setGithubHandles(segment.github_user_logins.join("\n"));
			} else {
				setSegmentType("repositories");
			}

			if (segment.repositories && segment.repositories.length > 0) {
				setRepoUrls(segment.repositories.join("\n"));
			}
		}
	}, [segment, open]);

	const updateSegmentMutation = useUpdateSegment({
		onSuccess() {
			setOpen(false);
		},
	});

	const handleUpdateSegment = () => {
		if (!segmentName.trim()) return;

		// Parse contributors from text input if any
		const contributors =
			segmentType === "contributors" && githubHandles.trim()
				? githubHandles
						.split(/[\s,]+/)
						.map((handle) => handle.trim().replace("@", ""))
						.filter(Boolean)
				: [];

		// Parse repositories from text input if any
		const repositories =
			segmentType === "repositories" && repoUrls.trim()
				? repoUrls
						.split(/[\s,]+/)
						.map((url) => url.trim())
						.filter(Boolean)
						.map(parseRepositoryUrl) // Use our repository parsing function
						.filter(Boolean)
				: [];

		updateSegmentMutation.mutate({
			id: segment.id,
			name: segmentName,
			description: segmentDescription,
			github_user_logins: contributors,
			repositories,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="outline" size="icon">
						<Pencil className="h-4 w-4" />
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Edit Segment</DialogTitle>
					<DialogDescription>Update the segment details.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input
							id="name"
							value={segmentName}
							onChange={(e) => setSegmentName(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="description" className="text-right">
							Description
						</Label>
						<Textarea
							id="description"
							value={segmentDescription}
							onChange={(e) => setSegmentDescription(e.target.value)}
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
										placeholder="Enter GitHub URLs or owner/repo format (e.g., github.com/user/repo or user/repo)"
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
										placeholder="Enter GitHub usernames separated by commas, spaces, or new lines"
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

					<Button onClick={handleUpdateSegment} disabled={updateSegmentMutation.isPending}>
						{updateSegmentMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Updating...
							</>
						) : (
							"Update Segment"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
