"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useContributor } from "@/lib/react-query/contributors";
import { formatDate } from "@/lib/utils";
import { Calendar, ExternalLink, GitBranch, GitCommit, GitPullRequest, Star } from "lucide-react";

interface ContributorDetailPanelProps {
	contributorId: string | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ContributorDetailPanel({ contributorId, isOpen, onOpenChange }: ContributorDetailPanelProps) {
	// Fetch selected contributor details
	const { data: selectedContributor, isLoading: isLoadingDetails } = useContributor(contributorId ?? "", {
		enabled: !!contributorId && isOpen,
	});

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
				{isLoadingDetails ? (
					<>
						<SheetTitle className="sr-only">Loading...</SheetTitle>
						<div className="flex flex-col gap-4 mt-8">
							<div className="h-6 bg-muted rounded animate-pulse w-2/3"></div>
							<div className="h-4 bg-muted rounded animate-pulse w-full"></div>
							<div className="h-20 bg-muted rounded animate-pulse w-full mt-4"></div>
							<div className="grid grid-cols-2 gap-4 mt-4">
								<div className="h-16 bg-muted rounded animate-pulse"></div>
								<div className="h-16 bg-muted rounded animate-pulse"></div>
							</div>
						</div>
					</>
				) : selectedContributor ? (
					<>
						<SheetHeader className="mb-6">
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={selectedContributor.avatar} alt={selectedContributor.name} />
									<AvatarFallback>
										{selectedContributor.name.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<SheetTitle className="text-xl flex items-center gap-2 mb-1">
										{selectedContributor.name}
										<a
											href={`https://github.com/${selectedContributor.handle}`}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex h-5 w-5 text-muted-foreground hover:text-primary"
										>
											<ExternalLink size={18} />
										</a>
									</SheetTitle>
									<SheetDescription>@{selectedContributor.handle}</SheetDescription>
								</div>
							</div>
						</SheetHeader>

						{/* Contributor Stats */}
						<div className="space-y-6">
							{/* Type and Tenure */}
							<div className="flex gap-3">
								<Badge variant="secondary" className="text-sm py-1.5">
									{selectedContributor.type}
								</Badge>
								<Badge variant="outline" className="text-sm py-1.5">
									{selectedContributor.tenure}
								</Badge>
							</div>

							{/* Overview Stats */}
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<GitPullRequest className="h-6 w-6 mb-2 text-primary" />
									<div className="text-sm text-muted-foreground">PRs Merged</div>
									<div className="mt-1 text-lg font-semibold">{selectedContributor.prMerged}</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<GitCommit className="h-6 w-6 mb-2 text-primary" />
									<div className="text-sm text-muted-foreground">Commits</div>
									<div className="mt-1 text-lg font-semibold">{selectedContributor.commits}</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<Star className="h-6 w-6 mb-2 text-amber-500" />
									<div className="text-sm text-muted-foreground">Stars</div>
									<div className="mt-1 text-lg font-semibold">{selectedContributor.stars}</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<Calendar className="h-6 w-6 mb-2 text-blue-500" />
									<div className="text-sm text-muted-foreground">Last Active</div>
									<div className="mt-1 text-sm font-medium">
										{formatDate(selectedContributor.lastActive)}
									</div>
								</div>
							</div>

							{/* Repositories */}
							{selectedContributor.repositories && (
								<div>
									<h3 className="text-md font-medium mb-3">Active Repositories</h3>
									<div className="space-y-3 bg-muted/30 rounded-lg p-4">
										{selectedContributor.repositories.map((repo) => (
											<a
												key={repo.id}
												href={repo.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
											>
												<div className="flex items-center gap-2">
													<GitBranch className="h-4 w-4 text-muted-foreground" />
													<div className="font-medium text-sm">{repo.name}</div>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-xs text-muted-foreground">
														{repo.contributions} contributions
													</span>
												</div>
											</a>
										))}
									</div>
								</div>
							)}

							{/* Last Active */}
							<div className="pt-4 border-t">
								<div className="flex justify-between items-center text-sm">
									<span className="text-muted-foreground">Last Active</span>
									<span>{formatDate(selectedContributor.lastActive)}</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="flex justify-center items-center h-40">
						<p>No contributor selected</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
