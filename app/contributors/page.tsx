"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contributor, getContributors } from "@/lib/contributors-service";
import { ContributorSublist, getContributorSublists, updateContributorSublist, createContributorSublist } from "@/lib/contributor-sublists-service";
import { formatDate } from "@/lib/utils";
import { Check, ChevronDown, GitBranch, GitCommit, GitPullRequest, GitPullRequestClosed, MessageSquare, PlusCircle, Search, SlidersHorizontal, X, Users, MapPin, Building, Star, UserPlus, Activity, Code, Award, ExternalLink, Github, Twitter, Linkedin, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [filteredContributors, setFilteredContributors] = useState<Contributor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Contributor | null;
    direction: 'ascending' | 'descending';
  }>({ key: null, direction: 'descending' });
  
  // Filter states
  const [minPRs, setMinPRs] = useState<number | "">("");
  const [minCommits, setMinCommits] = useState<number | "">("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Selection states
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [sublists, setSublists] = useState<ContributorSublist[]>([]);
  const [isAddToListDialogOpen, setIsAddToListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  
  // Add contributors by GitHub handles states
  const [isAddContributorsDialogOpen, setIsAddContributorsDialogOpen] = useState(false);
  const [githubHandles, setGithubHandles] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [selectedListsForNewContributors, setSelectedListsForNewContributors] = useState<string[]>([]);
  const [isCreateListFromImportOpen, setIsCreateListFromImportOpen] = useState(false);
  const [newContributorsToAdd, setNewContributorsToAdd] = useState<Contributor[]>([]);
  const [listSearchQuery, setListSearchQuery] = useState("");

  // Add new state for expanded rows
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  
  // Toggle row expansion
  const toggleRowExpansion = (contributorId: string) => {
    setExpandedRows(prev => 
      prev.includes(contributorId)
        ? prev.filter(id => id !== contributorId)
        : [...prev, contributorId]
    );
  };

  // Fetch contributors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [data, sublistsData] = await Promise.all([
          getContributors(),
          getContributorSublists()
        ]);
        setContributors(data);
        setFilteredContributors(data);
        setSublists(sublistsData);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply all filters
  useEffect(() => {
    let filtered = [...contributors];
    let activeFilters = 0;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((contributor) =>
        contributor.name.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply minimum PRs filter
    if (minPRs !== "") {
      filtered = filtered.filter(
        (contributor) => contributor.prMerged + contributor.prOpened >= Number(minPRs)
      );
      activeFilters++;
    }

    // Apply minimum commits filter
    if (minCommits !== "") {
      filtered = filtered.filter(
        (contributor) => contributor.commits >= Number(minCommits)
      );
      activeFilters++;
    }

    // Apply active only filter
    if (showActiveOnly) {
      // Consider contributors active if they have activity in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      filtered = filtered.filter((contributor) => {
        const lastActiveDate = new Date(contributor.lastActive);
        return lastActiveDate >= thirtyDaysAgo;
      });
      activeFilters++;
    }

    setActiveFiltersCount(activeFilters);
    setFilteredContributors(filtered);
  }, [searchQuery, contributors, minPRs, minCommits, showActiveOnly]);

  // Handle sorting
  const requestSort = (key: keyof Contributor) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredContributors].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredContributors(sortedData);
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (key: keyof Contributor) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Reset all filters
  const resetFilters = () => {
    setMinPRs("");
    setMinCommits("");
    setShowActiveOnly(false);
  };

  // Handle contributor selection
  const toggleContributorSelection = (contributorId: string) => {
    setSelectedContributors(prev => 
      prev.includes(contributorId)
        ? prev.filter(id => id !== contributorId)
        : [...prev, contributorId]
    );
  };

  // Handle select all contributors
  const toggleSelectAll = () => {
    if (selectedContributors.length === filteredContributors.length) {
      setSelectedContributors([]);
    } else {
      setSelectedContributors(filteredContributors.map(c => c.id));
    }
  };

  // Add selected contributors to an existing list
  const addToExistingList = async (sublistId: string) => {
    try {
      const sublist = sublists.find(s => s.id === sublistId);
      if (!sublist) return;

      // Create a new set to avoid duplicates
      const updatedContributorIds = Array.from(
        new Set([...sublist.contributorIds, ...selectedContributors])
      );

      const updatedSublist = await updateContributorSublist(sublistId, {
        contributorIds: updatedContributorIds
      });

      if (updatedSublist) {
        // Update the local state
        setSublists(prev => 
          prev.map(s => s.id === sublistId ? updatedSublist : s)
        );

        toast({
          title: "Contributors added",
          description: `${selectedContributors.length} contributors added to "${sublist.name}"`,
        });

        // Clear selection
        setSelectedContributors([]);
      }
    } catch (error) {
      console.error("Error adding contributors to list:", error);
      toast({
        title: "Error",
        description: "Failed to add contributors to list",
        variant: "destructive",
      });
    }
  };

  // Create a new list with selected contributors
  const createNewList = async () => {
    // This will be implemented in the dialog
    setIsAddToListDialogOpen(true);
    setIsCreatingNewList(true);
  };

  // Handle adding contributors by GitHub handles
  const handleAddContributors = () => {
    setIsAddContributorsDialogOpen(true);
    setGithubHandles("");
    setImportError("");
    setImportSuccess("");
    setSelectedListsForNewContributors([]);
    setNewContributorsToAdd([]);
  };

  // Toggle a list selection for new contributors
  const toggleListSelection = (listId: string, checked?: boolean) => {
    if (checked !== undefined) {
      // Called from checkbox
      setSelectedListsForNewContributors(prev => 
        checked 
          ? [...prev, listId]
          : prev.filter(id => id !== listId)
      );
    } else {
      // Called from button
      setSelectedListsForNewContributors(prev => 
        prev.includes(listId)
          ? prev.filter(id => id !== listId)
          : [...prev, listId]
      );
    }
  };

  // Select all lists
  const selectAllLists = () => {
    setSelectedListsForNewContributors(sublists.map(list => list.id));
  };

  // Clear all selected lists
  const clearAllLists = () => {
    setSelectedListsForNewContributors([]);
  };

  // Process GitHub handles and add contributors
  const handleImportGithubHandles = async () => {
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
    const newContributors: Contributor[] = [];
    
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
        // Create a new contributor for unmatched handle
        const newContributor: Contributor = {
          id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Generate a unique ID
          name: cleanHandle,
          handle: cleanHandle,
          avatar: `https://github.com/${cleanHandle}.png`,
          type: 'One-Time',
          tenure: 'Newcomer',
          description: 'New contributor',
          location: 'Unknown',
          organizations: [],
          prMerged: 0,
          prOpened: 0,
          issuesOpened: 0,
          issuesClosed: 0,
          commits: 0,
          lastActive: new Date().toISOString().split('T')[0],
          latestCommit: {
            message: 'No commits yet',
            date: new Date().toISOString().split('T')[0],
            url: `https://github.com/${cleanHandle}`
          },
          socialLinks: {
            github: `https://github.com/${cleanHandle}`
          },
          activityScore: 0,
          languages: [],
          reputationScore: 0,
          stars: 0,
          followers: 0
        };
        newContributors.push(newContributor);
      }
    });
    
    // Add new contributors to the contributors list
    if (newContributors.length > 0) {
      const updatedContributors = [...contributors, ...newContributors];
      setContributors(updatedContributors);
      setFilteredContributors(updatedContributors);
    }
    
    // Combine matched and new contributors
    const allAddedContributors = [...matchedContributors, ...newContributors];
    setNewContributorsToAdd(allAddedContributors);
    
    // Show results
    const totalAdded = newContributors.length;
    const totalMatched = matchedContributors.length;
    
    if (totalAdded > 0 || totalMatched > 0) {
      let successMessage = "";
      
      if (totalAdded > 0) {
        successMessage = `Successfully added ${totalAdded} new contributor${totalAdded === 1 ? '' : 's'}`;
        if (totalMatched > 0) {
          successMessage += ` and matched ${totalMatched} existing contributor${totalMatched === 1 ? '' : 's'}`;
        }
      } else if (totalMatched > 0) {
        successMessage = `Matched ${totalMatched} existing contributor${totalMatched === 1 ? '' : 's'}`;
      }
      
      setImportSuccess(successMessage);
      
      toast({
        title: "Contributors processed",
        description: successMessage,
      });
      
      // Add to selected lists if any were chosen
      if (selectedListsForNewContributors.length > 0) {
        try {
          const contributorIds = allAddedContributors.map(c => c.id);
          
          // Process each selected list
          const updatePromises = selectedListsForNewContributors.map(async (listId) => {
            const sublist = sublists.find(s => s.id === listId);
            if (!sublist) return null;
            
            // Create a new set to avoid duplicates
            const updatedContributorIds = Array.from(
              new Set([...sublist.contributorIds, ...contributorIds])
            );

            return updateContributorSublist(listId, {
              contributorIds: updatedContributorIds
            });
          });
          
          const updatedSublists = await Promise.all(updatePromises);
          const validUpdatedSublists = updatedSublists.filter(Boolean) as ContributorSublist[];
          
          if (validUpdatedSublists.length > 0) {
            // Update the local state
            setSublists(prev => 
              prev.map(s => {
                const updated = validUpdatedSublists.find(u => u.id === s.id);
                return updated || s;
              })
            );

            toast({
              title: "Contributors added to lists",
              description: `${contributorIds.length} contributors added to ${validUpdatedSublists.length} list${validUpdatedSublists.length === 1 ? '' : 's'}`,
            });
          }
        } catch (error) {
          console.error("Error adding contributors to lists:", error);
          toast({
            title: "Error",
            description: "Failed to add contributors to one or more lists",
            variant: "destructive",
          });
        }
      }
      
      // Close the dialog after a short delay if we're not creating a new list
      if (!isCreateListFromImportOpen) {
        setTimeout(() => {
          setIsAddContributorsDialogOpen(false);
        }, 1500);
      }
    } else {
      setImportError("No contributors were added. All handles already exist.");
    }
  };

  // Handle creating a new list from the import dialog
  const handleCreateListFromImport = () => {
    // Parse GitHub handles first if not already done
    if (newContributorsToAdd.length === 0 && githubHandles.trim()) {
      handleImportGithubHandles();
    }
    
    setIsCreateListFromImportOpen(true);
    setNewListName("");
    setNewListDescription("");
  };

  // Get tenure color - no longer needed with default badges
  const getTenureColor = (tenure: string) => {
    return '';
  };
  
  // Get type color - no longer needed with default badges
  const getTypeColor = (type: string) => {
    return '';
  };

  return (
    <div className="w-full max-w-full py-6">
      <div className="flex justify-between items-center mb-6 w-full">
        <div>
          <h1 className="text-3xl font-bold">Contributors</h1>
          <p className="text-muted-foreground">Overview of all contributors and their activity metrics.</p>
        </div>
        <div className="flex space-x-2">
          {selectedContributors.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to List
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Add to List</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sublists.length > 0 ? (
                  <>
                    <DropdownMenuGroup>
                      {sublists.map((sublist) => (
                        <DropdownMenuItem 
                          key={sublist.id}
                          onClick={() => addToExistingList(sublist.id)}
                        >
                          {sublist.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <DropdownMenuItem onClick={createNewList}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="default" onClick={handleAddContributors}>
            <Users className="mr-2 h-4 w-4" />
            Add Contributors
          </Button>
          <Link href="/contributors/sublists">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Sublists
            </Button>
          </Link>
        </div>
      </div>
      <Separator className="mb-6" />
      
      <Card className="w-full max-w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Contributors Activity</CardTitle>
              <CardDescription>
                Detailed metrics for all contributors including PRs, issues, and commits.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contributors..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 relative">
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                    <span className="sr-only">Filters</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={resetFilters}
                        disabled={!minPRs && !minCommits && !showActiveOnly}
                      >
                        Reset
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="min-prs">Minimum PRs (opened + merged)</Label>
                      <Input
                        id="min-prs"
                        type="number"
                        min="0"
                        placeholder="Enter minimum PRs"
                        value={minPRs}
                        onChange={(e) => setMinPRs(e.target.value ? Number(e.target.value) : "")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-commits">Minimum Commits</Label>
                      <Input
                        id="min-commits"
                        type="number"
                        min="0"
                        placeholder="Enter minimum commits"
                        value={minCommits}
                        onChange={(e) => setMinCommits(e.target.value ? Number(e.target.value) : "")}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="active-only" 
                        checked={showActiveOnly}
                        onCheckedChange={(checked) => setShowActiveOnly(checked === true)}
                      />
                      <Label htmlFor="active-only">Show active contributors only (last 30 days)</Label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading contributors data...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedContributors.length === filteredContributors.length && filteredContributors.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center font-medium text-left"
                        onClick={() => requestSort('name')}
                      >
                        Contributor{getSortDirectionIndicator('name')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center font-medium text-left"
                        onClick={() => requestSort('handle')}
                      >
                        <span>Handle{getSortDirectionIndicator('handle')}</span>
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center font-medium text-left"
                        onClick={() => requestSort('type')}
                      >
                        <span>Type{getSortDirectionIndicator('type')}</span>
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center font-medium text-left"
                        onClick={() => requestSort('tenure')}
                      >
                        <span>Tenure{getSortDirectionIndicator('tenure')}</span>
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button 
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={() => requestSort('activityScore')}
                      >
                        <span>Activity{getSortDirectionIndicator('activityScore')}</span>
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button 
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={() => requestSort('reputationScore')}
                      >
                        <span>Reputation{getSortDirectionIndicator('reputationScore')}</span>
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button 
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={() => requestSort('stars')}
                      >
                        <span>Stars{getSortDirectionIndicator('stars')}</span>
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button 
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={() => requestSort('followers')}
                      >
                        <span>Followers{getSortDirectionIndicator('followers')}</span>
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button 
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={() => requestSort('prMerged')}
                      >
                        <span>PRs Merged{getSortDirectionIndicator('prMerged')}</span>
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button 
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={() => requestSort('commits')}
                      >
                        <span>Commits{getSortDirectionIndicator('commits')}</span>
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <button 
                        className="flex items-center justify-end w-full"
                        onClick={() => requestSort('lastActive')}
                      >
                        Last Active{getSortDirectionIndicator('lastActive')}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContributors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="h-24 text-center">
                        No contributors found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContributors.map((contributor) => (
                      <>
                        <TableRow 
                          key={contributor.id} 
                          className={selectedContributors.includes(contributor.id) ? "bg-muted/50" : ""}
                          onClick={() => toggleRowExpansion(contributor.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox 
                              checked={selectedContributors.includes(contributor.id)}
                              onCheckedChange={() => toggleContributorSelection(contributor.id)}
                              aria-label={`Select ${contributor.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <img src={contributor.avatar} alt={contributor.name} />
                              </Avatar>
                              <span className="font-medium">{contributor.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>@{contributor.handle}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {contributor.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {contributor.tenure}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span>{contributor.activityScore}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span>{contributor.reputationScore}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span>{contributor.stars}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span>{contributor.followers}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{contributor.prMerged}</TableCell>
                          <TableCell className="text-center">{contributor.commits}</TableCell>
                          <TableCell className="text-right">{formatDate(contributor.lastActive)}</TableCell>
                        </TableRow>
                        {expandedRows.includes(contributor.id) && (
                          <TableRow className="bg-muted/20">
                            <TableCell colSpan={12} className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-lg font-medium mb-2">Profile</h3>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm text-muted-foreground">Description:</span>
                                      <p>{contributor.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span>{contributor.location}</span>
                                    </div>
                                    {contributor.organizations.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-wrap gap-1">
                                          {contributor.organizations.map((org, index) => (
                                            <Badge key={index} variant="outline">{org}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      {contributor.socialLinks.github && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <a href={contributor.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
                                              </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>GitHub</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                      {contributor.socialLinks.twitter && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <a href={contributor.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                                <Twitter className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
                                              </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Twitter</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                      {contributor.socialLinks.linkedin && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <a href={contributor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
                                              </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>LinkedIn</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                      {contributor.socialLinks.website && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <a href={contributor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                                <Globe className="h-4 w-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200" />
                                              </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Website</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium mb-2">Activity</h3>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm text-muted-foreground">Latest Commit:</span>
                                      <div className="flex items-center gap-1 mt-1">
                                        <GitCommit className="h-4 w-4 text-muted-foreground" />
                                        <a 
                                          href={contributor.latestCommit.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm hover:underline flex items-center gap-1"
                                        >
                                          {contributor.latestCommit.message}
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {formatDate(contributor.latestCommit.date)}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-muted-foreground">Languages:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {contributor.languages.map((lang, index) => (
                                          <Badge key={index} variant="outline" className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                            <Code className="h-3 w-3" />
                                            {lang.name} ({lang.percentage}%)
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for creating a new list */}
      <Dialog open={isAddToListDialogOpen} onOpenChange={setIsAddToListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>
              Create a new list with the selected contributors.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="list-name">List Name</Label>
              <Input
                id="list-name"
                placeholder="Enter list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-description">Description (optional)</Label>
              <Input
                id="list-description"
                placeholder="Enter description"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedContributors.length} contributors will be added to this list.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToListDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                if (!newListName.trim()) return;
                
                try {
                  const newSublist = await createContributorSublist({
                    name: newListName,
                    description: newListDescription,
                    contributorIds: selectedContributors
                  });
                  
                  setSublists([...sublists, newSublist]);
                  setNewListName("");
                  setNewListDescription("");
                  setSelectedContributors([]);
                  setIsAddToListDialogOpen(false);
                  
                  toast({
                    title: "List created",
                    description: `New list "${newListName}" created with ${selectedContributors.length} contributors`,
                  });
                } catch (error) {
                  console.error("Error creating list:", error);
                  toast({
                    title: "Error",
                    description: "Failed to create list",
                    variant: "destructive",
                  });
                }
              }}
              disabled={!newListName.trim()}
            >
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding contributors by GitHub handles */}
      <Dialog open={isAddContributorsDialogOpen} onOpenChange={setIsAddContributorsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contributors</DialogTitle>
            <DialogDescription>
              Add contributors by their GitHub handles. Separate multiple handles with commas, spaces, or new lines.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="github-handles">GitHub Handles</Label>
              <Textarea
                id="github-handles"
                placeholder="e.g., octocat, user1, user2"
                value={githubHandles}
                onChange={(e) => setGithubHandles(e.target.value)}
                className="min-h-[120px]"
              />
              {importError && (
                <p className="text-sm text-destructive mt-2">{importError}</p>
              )}
              {importSuccess && (
                <p className="text-sm text-green-600 mt-2">{importSuccess}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contributor-list">Add to Lists (Optional)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search lists..."
                      className="pl-8"
                      value={listSearchQuery}
                      onChange={(e) => setListSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCreateListFromImport}
                    type="button"
                    title="Create new list"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                {selectedListsForNewContributors.length > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedListsForNewContributors.length} of {sublists.length} lists selected
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={selectAllLists}
                        disabled={selectedListsForNewContributors.length === sublists.length}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearAllLists}
                        disabled={selectedListsForNewContributors.length === 0}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
                
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  {sublists.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2">No lists available. Create a new list to get started.</p>
                  ) : (
                    <div className="space-y-1">
                      {sublists
                        .filter(sublist => 
                          listSearchQuery === "" || 
                          sublist.name.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
                          (sublist.description && sublist.description.toLowerCase().includes(listSearchQuery.toLowerCase()))
                        )
                        .map(sublist => (
                          <div 
                            key={sublist.id} 
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                              selectedListsForNewContributors.includes(sublist.id) 
                                ? 'bg-secondary' 
                                : 'hover:bg-secondary/50'
                            }`}
                            onClick={() => toggleListSelection(sublist.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={selectedListsForNewContributors.includes(sublist.id)}
                                onCheckedChange={(checked) => toggleListSelection(sublist.id, checked as boolean)}
                                id={`list-${sublist.id}`}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Label 
                                htmlFor={`list-${sublist.id}`}
                                className="cursor-pointer text-sm font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {sublist.name}
                              </Label>
                            </div>
                            {sublist.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {sublist.description}
                              </span>
                            )}
                          </div>
                        ))
                      }
                      {listSearchQuery && !sublists.some(sublist => 
                        sublist.name.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
                        (sublist.description && sublist.description.toLowerCase().includes(listSearchQuery.toLowerCase()))
                      ) && (
                        <p className="text-sm text-muted-foreground p-2">No lists match your search.</p>
                      )}
                    </div>
                  )}
                </ScrollArea>
                
                {selectedListsForNewContributors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <p className="text-sm font-medium">Selected lists:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedListsForNewContributors.map(listId => {
                        const list = sublists.find(s => s.id === listId);
                        if (!list) return null;
                        
                        return (
                          <div 
                            key={listId} 
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                          >
                            <span>{list.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => toggleListSelection(listId)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddContributorsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleImportGithubHandles}>
              Add Contributors
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for creating a new list from import */}
      <Dialog 
        open={isCreateListFromImportOpen} 
        onOpenChange={(open) => {
          setIsCreateListFromImportOpen(open);
          // Don't close the Add Contributors dialog when this dialog is closed
          if (!open && isAddContributorsDialogOpen) {
            // If a list was created and selected, update the UI
            if (selectedListsForNewContributors.length > 0) {
              toast({
                title: "Lists selected",
                description: `Contributors will be added to the selected lists`,
              });
            }
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>
              Create a new list with the imported contributors.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-list-name">List Name</Label>
              <Input
                id="new-list-name"
                placeholder="Enter list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-list-description">Description (optional)</Label>
              <Input
                id="new-list-description"
                placeholder="Enter description"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {newContributorsToAdd.length} contributors will be added to this list.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateListFromImportOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                if (!newListName.trim() || newContributorsToAdd.length === 0) return;
                
                try {
                  const newSublist = await createContributorSublist({
                    name: newListName,
                    description: newListDescription,
                    contributorIds: newContributorsToAdd.map(c => c.id)
                  });
                  
                  setSublists([...sublists, newSublist]);
                  setNewListName("");
                  setNewListDescription("");
                  setIsCreateListFromImportOpen(false);
                  setSelectedListsForNewContributors(prev => [...prev, newSublist.id]);
                  
                  toast({
                    title: "List created",
                    description: `New list "${newListName}" created with ${newContributorsToAdd.length} contributors`,
                  });
                } catch (error) {
                  console.error("Error creating list:", error);
                  toast({
                    title: "Error",
                    description: "Failed to create list",
                    variant: "destructive",
                  });
                }
              }}
              disabled={!newListName.trim() || newContributorsToAdd.length === 0}
            >
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 