import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getContributors } from "@/lib/contributors-service";
import { formatDate } from "@/lib/utils";
import { GitBranch, GitCommit, GitPullRequest, GitPullRequestClosed, MessageSquare } from "lucide-react";
import { Suspense } from "react";

export default async function ContributorsPage() {
  // Fetch contributors data
  const contributors = await getContributors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contributors</h1>
        <p className="text-muted-foreground">Overview of all contributors and their activity metrics.</p>
      </div>
      <Separator />

      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Contributors Activity</CardTitle>
              <CardDescription>
                Detailed metrics for all contributors including PRs, issues, and commits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading contributors data...</div>}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contributor</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <GitPullRequestClosed className="h-4 w-4" />
                          <span>PRs Merged</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <GitPullRequest className="h-4 w-4" />
                          <span>PRs Opened</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>Issues Opened</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          <span>Issues Closed</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <GitCommit className="h-4 w-4" />
                          <span>Commits</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributors.map((contributor) => (
                      <TableRow key={contributor.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <img src={contributor.avatar} alt={contributor.name} />
                            </Avatar>
                            <span className="font-medium">{contributor.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{contributor.prMerged}</TableCell>
                        <TableCell className="text-center">{contributor.prOpened}</TableCell>
                        <TableCell className="text-center">{contributor.issuesOpened}</TableCell>
                        <TableCell className="text-center">{contributor.issuesClosed}</TableCell>
                        <TableCell className="text-center">{contributor.commits}</TableCell>
                        <TableCell className="text-right">{formatDate(contributor.lastActive)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 