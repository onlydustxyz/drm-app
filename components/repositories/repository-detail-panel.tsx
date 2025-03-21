"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRepository } from "@/lib/react-query/repositories";
import { formatDate } from "@/lib/utils";
import { BookOpen, ExternalLink, GitBranch, GitCommit, GitPullRequest, Star, Users } from "lucide-react";

interface RepositoryDetailPanelProps {
	repositoryId: string | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function RepositoryDetailPanel({ repositoryId, isOpen, onOpenChange }: RepositoryDetailPanelProps) {
	// Fetch selected repository details
	const { data: selectedRepository, isLoading: isLoadingDetails } = useRepository(repositoryId ?? "", {
		enabled: !!repositoryId && isOpen,
	});

	// Mock contributors data
	const mockContributors = [
		{
			id: 1,
			username: "alexdev",
			name: "Alex Johnson",
			avatar: "https://github.com/identicons/jasonlong.png",
			profileUrl: "https://github.com/alexdev",
		},
		{
			id: 2,
			username: "sarahcodes",
			name: "Sarah Chen",
			avatar: "https://github.com/identicons/octocat.png",
			profileUrl: "https://github.com/sarahcodes",
		},
		{
			id: 3,
			username: "mikeprog",
			name: "Mike Rodriguez",
			avatar: "https://github.com/identicons/ghost.png",
			profileUrl: "https://github.com/mikeprog",
		},
		{
			id: 4,
			username: "emilyhacker",
			name: "Emily Taylor",
			avatar: "https://github.com/identicons/torvalds.png",
			profileUrl: "https://github.com/emilyhacker",
		},
		{
			id: 5,
			username: "devjones",
			name: "David Jones",
			avatar: "https://github.com/identicons/defunkt.png",
			profileUrl: "https://github.com/devjones",
		},
	];

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
				) : selectedRepository ? (
					<>
						<SheetHeader className="mb-6">
							<SheetTitle className="text-xl flex items-center gap-2 mb-1">
								{selectedRepository.name}
								<a
									href={selectedRepository.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex h-5 w-5 text-muted-foreground hover:text-primary"
								>
									<ExternalLink size={18} />
								</a>
							</SheetTitle>
							<SheetDescription>{selectedRepository.description}</SheetDescription>
						</SheetHeader>

						{/* Repository Stats */}
						<div className="space-y-6">
							{/* Overview Stats */}
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<GitPullRequest className="h-6 w-6 mb-2 text-primary" />
									<div className="text-sm text-muted-foreground">Pull Requests</div>
									<div className="mt-1 text-lg font-semibold">
										{selectedRepository.prMerged + selectedRepository.prOpened}
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										{selectedRepository.prMerged} merged / {selectedRepository.prOpened} open
									</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<BookOpen className="h-6 w-6 mb-2 text-primary" />
									<div className="text-sm text-muted-foreground">Issues</div>
									<div className="mt-1 text-lg font-semibold">
										{selectedRepository.issuesOpened + selectedRepository.issuesClosed}
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										{selectedRepository.issuesClosed} closed / {selectedRepository.issuesOpened}{" "}
										open
									</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<GitCommit className="h-6 w-6 mb-2 text-primary" />
									<div className="text-sm text-muted-foreground">Commits</div>
									<div className="mt-1 text-lg font-semibold">{selectedRepository.commits}</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
									<Users className="h-6 w-6 mb-2 text-primary" />
									<div className="text-sm text-muted-foreground">Contributors</div>
									<div className="mt-1 text-lg font-semibold">{selectedRepository.contributors}</div>
								</div>
							</div>

							{/* Additional Metrics */}
							<div>
								<h3 className="text-md font-medium mb-3">Repository Metrics</h3>
								<div className="grid grid-cols-3 gap-3">
									<div className="bg-muted/30 rounded-lg p-3">
										<div className="flex flex-col">
											<span className="text-sm text-muted-foreground mb-1">Stars</span>
											<span className="font-medium flex items-center text-sm">
												<Star className="h-4 w-4 mr-1 text-amber-500" />
												{selectedRepository.stars}
											</span>
										</div>
									</div>
									<div className="bg-muted/30 rounded-lg p-3">
										<div className="flex flex-col">
											<span className="text-sm text-muted-foreground mb-1">Forks</span>
											<span className="font-medium flex items-center text-sm">
												<GitBranch className="h-4 w-4 mr-1 text-blue-500" />
												{selectedRepository.forks}
											</span>
										</div>
									</div>
									<div className="bg-muted/30 rounded-lg p-3">
										<div className="flex flex-col">
											<span className="text-sm text-muted-foreground mb-1">Watchers</span>
											<span className="font-medium text-sm">{selectedRepository.watchers}</span>
										</div>
									</div>
								</div>
							</div>

							{/* Programming Languages */}
							{selectedRepository.languages && selectedRepository.languages.length > 0 && (
								<div>
									<h3 className="text-md font-medium mb-3">Languages</h3>
									<div className="flex flex-wrap gap-2">
										{selectedRepository.languages.map((lang, idx) => (
											<Badge key={idx} variant="secondary">
												{lang.name}
											</Badge>
										))}
									</div>
								</div>
							)}

							{/* Contributors List */}
							<div>
								<h3 className="text-md font-medium mb-3">Contributors</h3>
								<div className="space-y-3 bg-muted/30 rounded-lg p-4">
									{mockContributors.map((contributor) => (
										<a
											key={contributor.id}
											href={contributor.profileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
										>
											<Avatar className="h-8 w-8">
												<AvatarImage src={contributor.avatar} alt={contributor.name} />
												<AvatarFallback>
													{contributor.username.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="font-medium text-sm">{contributor.username}</div>
										</a>
									))}
								</div>
							</div>

							{/* Last Updated */}
							<div className="pt-4 border-t">
								<div className="flex justify-between items-center text-sm">
									<span className="text-muted-foreground">Last Updated</span>
									<span>{formatDate(selectedRepository.last_updated_at)}</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="flex justify-center items-center h-40">
						<p>No repository selected</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
