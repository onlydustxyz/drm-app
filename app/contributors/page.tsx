import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getContributors } from "@/lib/contributors-service";
import { formatDate } from "@/lib/utils";
import { GitBranch, GitCommit, GitPullRequest, GitPullRequestClosed, MessageSquare, Users } from "lucide-react";
import { Suspense } from "react";

export default async function ContributorsPage() {
  // Fetch contributors data
  const contributors = await getContributors();
  
  // Calculate summary metrics
  const totalContributors = contributors.length;
  const totalPRsMerged = contributors.reduce((sum, contributor) => sum + contributor.prMerged, 0);
  const totalPRsOpened = contributors.reduce((sum, contributor) => sum + contributor.prOpened, 0);
  const totalCommits = contributors.reduce((sum, contributor) => sum + contributor.commits, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contributors</h1>
        <p className="text-muted-foreground">Overview of all contributors and their activity metrics.</p>
      </div>
      <Separator />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContributors}</div>
              <p className="text-xs text-muted-foreground">Active contributors in the ecosystem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PRs Merged</CardTitle>
              <GitPullRequestClosed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPRsMerged}</div>
              <p className="text-xs text-muted-foreground">Total pull requests merged</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PRs Opened</CardTitle>
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPRsOpened}</div>
              <p className="text-xs text-muted-foreground">Total pull requests opened</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
              <GitCommit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCommits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total commits across all repositories</p>
            </CardContent>
          </Card>
        </div>

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