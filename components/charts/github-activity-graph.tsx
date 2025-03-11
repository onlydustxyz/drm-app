"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, GitPullRequestIcon, UsersIcon, FolderIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Interface for contributor activity data
export interface ContributorActivity {
  id: string;
  name: string;
  avatar: string;
  projects: string[];
  weeklyActivity: {
    week: string; // ISO week string (YYYY-WW)
    prCount: number;
    repos: {
      name: string;
      prCount: number;
    }[];
  }[];
}

interface GitHubActivityGraphProps {
  data: ContributorActivity[];
}

// Helper function to get color intensity based on PR count
const getActivityColor = (prCount: number) => {
  if (prCount === 0) return "bg-gray-100";
  if (prCount <= 2) return "bg-green-100";
  if (prCount <= 5) return "bg-green-300";
  if (prCount <= 10) return "bg-green-500";
  return "bg-green-700";
};

// Format week string for display
const formatWeek = (weekStr: string) => {
  const [year, week] = weekStr.split('-');
  return `Week ${week}, ${year}`;
};

// Activity Legend Component
const ActivityLegend = () => (
  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
    <div className="flex items-center gap-1">
      <CalendarIcon className="h-4 w-4 text-gray-500" />
      <span className="text-xs font-medium text-gray-700">Activity Level:</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></div>
        <span className="text-xs">None</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-green-100 border border-gray-200 rounded-sm"></div>
        <span className="text-xs">1-2 PRs</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-green-300 border border-gray-200 rounded-sm"></div>
        <span className="text-xs">3-5 PRs</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-green-500 border border-gray-200 rounded-sm"></div>
        <span className="text-xs">6-10 PRs</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-green-700 border border-gray-200 rounded-sm"></div>
        <span className="text-xs">10+ PRs</span>
      </div>
    </div>
  </div>
);

export function GitHubActivityGraph({ data }: GitHubActivityGraphProps) {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"contributors" | "projects">("contributors");
  
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-lg font-medium text-gray-500 mb-2">No contributor activity data found</div>
        <p className="text-sm text-gray-400 text-center max-w-md">
          There are no contributors in this sublist, or the contributor data couldn't be loaded.
          Try adding contributors to this sublist.
        </p>
      </div>
    );
  }
  
  // Get all unique weeks across all contributors
  const allWeeks = Array.from(
    new Set(
      data.flatMap(contributor => 
        contributor.weeklyActivity.map(activity => activity.week)
      )
    )
  ).sort();
  
  // Get all unique repositories
  const allRepos = Array.from(
    new Set(
      data.flatMap(contributor => 
        contributor.weeklyActivity.flatMap(activity => 
          activity.repos.map(repo => repo.name)
        )
      )
    )
  ).sort();
  
  // Get all unique projects
  const allProjects = Array.from(
    new Set(
      data.flatMap(contributor => contributor.projects)
    )
  ).sort();
  
  // Filter data based on selected repository
  let filteredData = data;
  
  // Filter by contributor if selected
  if (selectedContributor) {
    filteredData = filteredData.filter(contributor => contributor.id === selectedContributor);
  }
  
  // Process data for repository filtering
  if (selectedRepo) {
    // We need to keep the original structure but filter the activity data
    filteredData = filteredData.map(contributor => {
      // Create a copy of the contributor with filtered activity
      const filteredActivity = contributor.weeklyActivity.map(activity => {
        // Filter repos to only include the selected repo
        const filteredRepos = activity.repos.filter(repo => repo.name === selectedRepo);
        
        // Calculate new prCount based on filtered repos
        const newPrCount = filteredRepos.reduce((sum, repo) => sum + repo.prCount, 0);
        
        return {
          ...activity,
          prCount: newPrCount,
          repos: filteredRepos
        };
      });
      
      return {
        ...contributor,
        weeklyActivity: filteredActivity
      };
    });
  }
  
  // Calculate total stats
  const totalPRs = filteredData.reduce((sum, contributor) => 
    sum + contributor.weeklyActivity.reduce((weekSum, week) => weekSum + week.prCount, 0), 0
  );
  
  const activeContributors = filteredData.filter(contributor => 
    contributor.weeklyActivity.some(activity => activity.prCount > 0)
  ).length;
  
  // Aggregate data by project
  const projectData = allProjects.map(project => {
    // Find all contributors for this project
    const projectContributors = filteredData.filter(contributor => 
      contributor.projects.includes(project)
    );
    
    // Aggregate weekly activity for this project
    const weeklyActivity = allWeeks.map(week => {
      // Sum PR counts across all contributors for this project and week
      const prCount = projectContributors.reduce((sum, contributor) => {
        const activity = contributor.weeklyActivity.find(a => a.week === week);
        return sum + (activity?.prCount || 0);
      }, 0);
      
      // Collect repo breakdown for this week
      const repoBreakdown: Record<string, number> = {};
      
      projectContributors.forEach(contributor => {
        const activity = contributor.weeklyActivity.find(a => a.week === week);
        if (activity) {
          activity.repos.forEach(repo => {
            repoBreakdown[repo.name] = (repoBreakdown[repo.name] || 0) + repo.prCount;
          });
        }
      });
      
      // Convert to array format
      const repos = Object.entries(repoBreakdown).map(([name, prCount]) => ({
        name,
        prCount
      })).filter(repo => repo.prCount > 0);
      
      return {
        week,
        prCount,
        repos
      };
    });
    
    // Count active contributors for this project
    const activeContributors = projectContributors.filter(contributor => 
      contributor.weeklyActivity.some(activity => activity.prCount > 0)
    ).length;
    
    // Calculate total PRs for this project
    const totalPRs = weeklyActivity.reduce((sum, week) => sum + week.prCount, 0);
    
    return {
      name: project,
      contributorCount: projectContributors.length,
      activeContributorCount: activeContributors,
      weeklyActivity,
      totalPRs
    };
  }).sort((a, b) => b.totalPRs - a.totalPRs); // Sort by total PRs
  
  // Render the contributor view
  const renderContributorView = () => (
    <div className="space-y-6">
      {/* Contributor filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedContributor(null)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors",
            selectedContributor === null 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <UsersIcon className="h-4 w-4" />
          All Contributors
        </button>
        {data.map(contributor => (
          <button
            key={contributor.id}
            onClick={() => setSelectedContributor(contributor.id)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors",
              selectedContributor === contributor.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <img 
              src={contributor.avatar} 
              alt={contributor.name} 
              className="w-5 h-5 rounded-full"
            />
            {contributor.name}
          </button>
        ))}
      </div>
      
      <ActivityLegend />
      
      {/* Activity graph by contributor */}
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-600 border-b">Contributor</th>
              <th className="text-left p-3 font-medium text-gray-600 border-b">Projects</th>
              <th className="text-left p-3 font-medium text-gray-600 border-b">
                <div className="flex">
                  {allWeeks.map((week, index) => (
                    <div 
                      key={week} 
                      className="w-6 text-xs text-center"
                      onMouseEnter={() => setHoveredWeek(week)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    >
                      {index % 4 === 0 ? week.split('-')[1] : ''}
                    </div>
                  ))}
                </div>
              </th>
              <th className="text-right p-3 font-medium text-gray-600 border-b">Activity</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 || filteredData.every(c => c.weeklyActivity.every(a => a.prCount === 0)) ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-gray-500">
                  No activity data found for the selected filters
                </td>
              </tr>
            ) : (
              filteredData.map(contributor => {
                // Skip contributors with no activity after repo filtering
                if (selectedRepo && contributor.weeklyActivity.every(a => a.prCount === 0)) {
                  return null;
                }
                
                // Calculate active weeks (weeks with PR activity)
                const activeWeeks = contributor.weeklyActivity.filter(a => a.prCount > 0).length;
                const activePercentage = Math.round((activeWeeks / allWeeks.length) * 100);
                
                // Calculate total PRs
                const totalPRs = contributor.weeklyActivity.reduce((sum, week) => sum + week.prCount, 0);
                
                return (
                  <tr key={contributor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <img 
                          src={contributor.avatar} 
                          alt={contributor.name} 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{contributor.name}</div>
                          <div className="text-xs text-gray-500">
                            <GitPullRequestIcon className="inline h-3 w-3 mr-1" />
                            {totalPRs} PRs
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex flex-wrap gap-1">
                        {contributor.projects.map(project => (
                          <Badge 
                            key={project} 
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex">
                        {contributor.weeklyActivity.map(activity => {
                          const prCount = activity.prCount;
                          
                          // Get repository breakdown for tooltip
                          const repoBreakdown = activity.repos.filter(r => r.prCount > 0);
                          
                          return (
                            <TooltipProvider key={activity.week}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={cn(
                                      "w-6 h-6 m-0.5 border border-gray-200 rounded-sm transition-transform hover:scale-110",
                                      getActivityColor(prCount),
                                      hoveredWeek === activity.week ? "ring-2 ring-primary ring-offset-1" : ""
                                    )}
                                    onMouseEnter={() => setHoveredWeek(activity.week)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="p-0 overflow-hidden">
                                  <div className="p-3 max-w-xs">
                                    <div className="font-medium text-sm mb-1 bg-gray-50 -m-3 mb-2 p-2 border-b">
                                      {formatWeek(activity.week)}
                                    </div>
                                    <p className="mb-2 flex items-center gap-1.5">
                                      <GitPullRequestIcon className="h-4 w-4 text-green-600" />
                                      <span className="font-medium">{prCount} PR{prCount !== 1 ? 's' : ''} merged</span>
                                    </p>
                                    
                                    {repoBreakdown.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="font-medium text-xs mb-1.5 text-gray-500">Repositories:</p>
                                        <ul className="space-y-1">
                                          {repoBreakdown.map(repo => (
                                            <li key={repo.name} className="flex justify-between text-sm">
                                              <span className="text-gray-700">{repo.name}:</span>
                                              <span className="ml-2 font-medium">{repo.prCount} PR{repo.prCount !== 1 ? 's' : ''}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-3 text-right border-b">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">{activeWeeks}/{allWeeks.length} weeks active</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1.5">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${activePercentage}%` }} 
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{activePercentage}% active</span>
                      </div>
                    </td>
                  </tr>
                );
              }).filter(Boolean)
            )}
          </tbody>
        </table>
      </div>
      
      {/* Week indicator */}
      {hoveredWeek && (
        <div className="text-sm text-gray-500 italic mt-2">
          Viewing: Week {hoveredWeek.split('-')[1]}, {hoveredWeek.split('-')[0]}
        </div>
      )}
    </div>
  );
  
  // Render the project view
  const renderProjectView = () => (
    <div className="space-y-6">
      <ActivityLegend />
      
      {/* Activity graph by project */}
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-600 border-b">Project</th>
              <th className="text-left p-3 font-medium text-gray-600 border-b">Contributors</th>
              <th className="text-left p-3 font-medium text-gray-600 border-b">
                <div className="flex">
                  {allWeeks.map((week, index) => (
                    <div 
                      key={week} 
                      className="w-6 text-xs text-center"
                      onMouseEnter={() => setHoveredWeek(week)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    >
                      {index % 4 === 0 ? week.split('-')[1] : ''}
                    </div>
                  ))}
                </div>
              </th>
              <th className="text-right p-3 font-medium text-gray-600 border-b">Activity</th>
            </tr>
          </thead>
          <tbody>
            {projectData.length === 0 || projectData.every(p => p.weeklyActivity.every(a => a.prCount === 0)) ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-gray-500">
                  No activity data found for the selected filters
                </td>
              </tr>
            ) : (
              projectData.map(project => {
                // Skip projects with no activity after repo filtering
                if (project.weeklyActivity.every(a => a.prCount === 0)) {
                  return null;
                }
                
                // Calculate active weeks (weeks with PR activity)
                const activeWeeks = project.weeklyActivity.filter(a => a.prCount > 0).length;
                const activePercentage = Math.round((activeWeeks / allWeeks.length) * 100);
                
                return (
                  <tr key={project.name} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <FolderIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-gray-500">
                            <GitPullRequestIcon className="inline h-3 w-3 mr-1" />
                            {project.totalPRs} PRs
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-sm font-medium">{project.activeContributorCount}/{project.contributorCount} active</span>
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${(project.activeContributorCount / Math.max(1, project.contributorCount)) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex">
                        {project.weeklyActivity.map(activity => {
                          const prCount = activity.prCount;
                          
                          // Get repository breakdown for tooltip
                          const repoBreakdown = activity.repos;
                          
                          return (
                            <TooltipProvider key={activity.week}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={cn(
                                      "w-6 h-6 m-0.5 border border-gray-200 rounded-sm transition-transform hover:scale-110",
                                      getActivityColor(prCount),
                                      hoveredWeek === activity.week ? "ring-2 ring-primary ring-offset-1" : ""
                                    )}
                                    onMouseEnter={() => setHoveredWeek(activity.week)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="p-0 overflow-hidden">
                                  <div className="p-3 max-w-xs">
                                    <div className="font-medium text-sm mb-1 bg-gray-50 -m-3 mb-2 p-2 border-b">
                                      {formatWeek(activity.week)}
                                    </div>
                                    <p className="mb-2 flex items-center gap-1.5">
                                      <GitPullRequestIcon className="h-4 w-4 text-green-600" />
                                      <span className="font-medium">{prCount} PR{prCount !== 1 ? 's' : ''} merged</span>
                                    </p>
                                    
                                    {repoBreakdown.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="font-medium text-xs mb-1.5 text-gray-500">Repositories:</p>
                                        <ul className="space-y-1">
                                          {repoBreakdown.map(repo => (
                                            <li key={repo.name} className="flex justify-between text-sm">
                                              <span className="text-gray-700">{repo.name}:</span>
                                              <span className="ml-2 font-medium">{repo.prCount} PR{repo.prCount !== 1 ? 's' : ''}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-3 text-right border-b">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">{activeWeeks}/{allWeeks.length} weeks active</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1.5">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${activePercentage}%` }} 
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{activePercentage}% active</span>
                      </div>
                    </td>
                  </tr>
                );
              }).filter(Boolean)
            )}
          </tbody>
        </table>
      </div>
      
      {/* Week indicator */}
      {hoveredWeek && (
        <div className="text-sm text-gray-500 italic mt-2">
          Viewing: Week {hoveredWeek.split('-')[1]}, {hoveredWeek.split('-')[0]}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Pull Requests</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <GitPullRequestIcon className="h-5 w-5 text-green-600" />
            {totalPRs}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Active Contributors</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-blue-600" />
            {activeContributors}/{filteredData.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Active Projects</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-amber-600" />
            {projectData.filter(p => p.weeklyActivity.some(a => a.prCount > 0)).length}/{projectData.length}
          </div>
        </div>
      </div>
      
      {/* Repository filter */}
      <div className="bg-white p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
          <GitPullRequestIcon className="h-4 w-4" />
          Filter by Repository
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRepo(null)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              selectedRepo === null 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All Repositories
          </button>
          {allRepos.map(repo => (
            <button
              key={repo}
              onClick={() => setSelectedRepo(repo)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                selectedRepo === repo 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {repo}
            </button>
          ))}
        </div>
      </div>
      
      {/* View toggle */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode" className="text-sm font-medium flex items-center gap-1.5">
              <UsersIcon className="h-4 w-4 text-blue-600" />
              Contributors
            </Label>
            <Switch
              id="view-mode"
              checked={viewMode === "projects"}
              onCheckedChange={(checked) => setViewMode(checked ? "projects" : "contributors")}
            />
            <Label htmlFor="view-mode" className="text-sm font-medium flex items-center gap-1.5">
              <FolderIcon className="h-4 w-4 text-amber-600" />
              Projects
            </Label>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {viewMode === "contributors" ? 
            `Showing ${filteredData.filter(c => c.weeklyActivity.some(a => a.prCount > 0)).length} active contributors` : 
            `Showing ${projectData.filter(p => p.weeklyActivity.some(a => a.prCount > 0)).length} active projects`
          }
        </div>
      </div>
      
      {/* Content based on view mode */}
      {viewMode === "contributors" ? renderContributorView() : renderProjectView()}
    </div>
  );
} 