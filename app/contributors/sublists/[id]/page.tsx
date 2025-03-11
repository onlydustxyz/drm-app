"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RetentionAreaChart, RetentionBarChart, RetentionChart } from "@/components/charts/retention-chart";
import { Contributor, getContributors } from "@/lib/contributors-service";
import { ContributorSublist, getContributorRetentionData, getContributorSublist, updateContributorSublist } from "@/lib/contributor-sublists-service";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, Edit, Users, Activity, BarChart3, Import, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SublistDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const sublistId = params.id;
  const [sublist, setSublist] = useState<ContributorSublist | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [filteredContributors, setFilteredContributors] = useState<Contributor[]>([]);
  const [retentionData, setRetentionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newSublistName, setNewSublistName] = useState("");
  const [newSublistDescription, setNewSublistDescription] = useState("");
  const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [importMode, setImportMode] = useState<"manual" | "import">("manual");
  const [githubHandles, setGithubHandles] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  // Fetch sublist and contributors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch sublist data
        const sublistData = await getContributorSublist(sublistId);
        if (!sublistData) {
          // Sublist not found, redirect to sublists page
          router.push("/contributors/sublists");
          return;
        }
        
        setSublist(sublistData);
        setNewSublistName(sublistData.name);
        setNewSublistDescription(sublistData.description);
        setSelectedContributorIds([...sublistData.contributorIds]);
        
        // Fetch contributors and retention data
        const [contributorsData, retentionData] = await Promise.all([
          getContributors(),
          getContributorRetentionData(sublistData.contributorIds)
        ]);
        
        setContributors(contributorsData);
        setFilteredContributors(contributorsData.filter(c => sublistData.contributorIds.includes(c.id)));
        setRetentionData(retentionData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sublistId, router]);

  const handleUpdateSublist = async () => {
    if (!sublist || !newSublistName.trim()) return;
    
    try {
      const updatedSublist = await updateContributorSublist(sublist.id, {
        name: newSublistName,
        description: newSublistDescription,
        contributorIds: selectedContributorIds
      });
      
      if (updatedSublist) {
        setSublist(updatedSublist);
        setFilteredContributors(contributors.filter(c => updatedSublist.contributorIds.includes(c.id)));
        setIsEditing(false);
        setImportMode("manual");
        setGithubHandles("");
        setImportError("");
        setImportSuccess("");
        
        // Update retention data
        const retentionData = await getContributorRetentionData(updatedSublist.contributorIds);
        setRetentionData(retentionData);
      }
    } catch (error) {
      console.error("Error updating sublist:", error);
    }
  };

  const handleCheckboxChange = (contributorId: string) => {
    setSelectedContributorIds(prev => 
      prev.includes(contributorId)
        ? prev.filter(id => id !== contributorId)
        : [...prev, contributorId]
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
      .map(handle => handle.trim())
      .filter(handle => handle.length > 0);
    
    if (handles.length === 0) {
      setImportError("No valid GitHub handles found");
      return;
    }

    // Find contributors matching the GitHub handles
    // For this mock implementation, we'll just match by name
    // In a real implementation, you would match by GitHub username
    const matchedContributors: Contributor[] = [];
    const unmatchedHandles: string[] = [];
    
    handles.forEach(handle => {
      // Remove @ prefix if present
      const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
      
      // Find contributor by name (in a real app, match by GitHub username)
      const contributor = contributors.find(c => 
        c.name.toLowerCase() === cleanHandle.toLowerCase()
      );
      
      if (contributor) {
        matchedContributors.push(contributor);
      } else {
        unmatchedHandles.push(cleanHandle);
      }
    });
    
    // Update selected contributor IDs
    const newSelectedIds = [
      ...selectedContributorIds,
      ...matchedContributors.map(c => c.id)
    ];
    
    // Remove duplicates
    setSelectedContributorIds([...new Set(newSelectedIds)]);
    
    // Show results
    if (matchedContributors.length > 0) {
      setImportSuccess(`Successfully matched ${matchedContributors.length} contributor${matchedContributors.length === 1 ? '' : 's'}`);
    }
    
    if (unmatchedHandles.length > 0) {
      setImportError(`Could not find contributors for: ${unmatchedHandles.join(', ')}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!sublist) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sublist Not Found</h1>
          <p className="mb-6">The requested sublist could not be found.</p>
          <Link href="/contributors/sublists">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Sublists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/contributors/sublists">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Sublists
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">{sublist.name}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{sublist.name}</CardTitle>
              <CardDescription>
                {sublist.description}
              </CardDescription>
            </div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Sublist
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Contributor Sublist</DialogTitle>
                  <DialogDescription>
                    Update the sublist details and contributors.
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
                                id={`edit-contributor-${contributor.id}`}
                                checked={selectedContributorIds.includes(contributor.id)}
                                onCheckedChange={() => handleCheckboxChange(contributor.id)}
                              />
                              <Label htmlFor={`edit-contributor-${contributor.id}`} className="cursor-pointer">
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
                                  ))
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateSublist}>
                    Update Sublist
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            <span className="font-medium">Created:</span> {formatDate(sublist.createdAt)} | 
            <span className="font-medium ml-2">Last Updated:</span> {formatDate(sublist.updatedAt)} | 
            <span className="font-medium ml-2">Contributors:</span> {sublist.contributorIds.length}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">
                <Users className="h-4 w-4 mr-2" />
                Contributors
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>PRs Merged</TableHead>
                    <TableHead>PRs Opened</TableHead>
                    <TableHead>Issues Opened</TableHead>
                    <TableHead>Issues Closed</TableHead>
                    <TableHead>Commits</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContributors.map((contributor) => (
                    <TableRow key={contributor.id}>
                      <TableCell className="font-medium">{contributor.name}</TableCell>
                      <TableCell>{contributor.prMerged}</TableCell>
                      <TableCell>{contributor.prOpened}</TableCell>
                      <TableCell>{contributor.issuesOpened}</TableCell>
                      <TableCell>{contributor.issuesClosed}</TableCell>
                      <TableCell>{contributor.commits}</TableCell>
                      <TableCell>{formatDate(contributor.lastActive)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Card>
                <CardHeader>
                  <CardTitle>Contributor Retention</CardTitle>
                  <CardDescription>
                    Monthly retention rate and active contributors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <RetentionChart data={retentionData} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 