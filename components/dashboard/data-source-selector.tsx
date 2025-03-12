"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type DataSource = {
  id: string;
  name: string;
  type: 'contributor-list' | 'project-list' | 'custom';
  description?: string;
};

export const dataSources: DataSource[] = [
  // Custom
  { id: "all", name: "All Data", type: 'custom', description: "All contributors across all projects" },
  
  // Contributor Lists
  { id: "active-contributors", name: "Active Contributors", type: 'contributor-list', description: "Contributors who made commits in the last 30 days" },
  { id: "full-time-devs", name: "Full-Time Developers", type: 'contributor-list', description: "Developers who contribute regularly" },
  { id: "top-contributors", name: "Top Contributors", type: 'contributor-list', description: "Top 100 contributors by commit count" },
  { id: "new-contributors", name: "New Contributors", type: 'contributor-list', description: "Contributors who joined in the last 90 days" },
  { id: "project-leads", name: "Project Leads", type: 'contributor-list', description: "Project maintainers and team leads" },
  { id: "community-contributors", name: "Community Contributors", type: 'contributor-list', description: "Non-core team contributors" },
  { id: "backend-devs", name: "Backend Developers", type: 'contributor-list', description: "Developers focused on backend code" },
  { id: "frontend-devs", name: "Frontend Developers", type: 'contributor-list', description: "Developers focused on frontend code" },
  { id: "contract-devs", name: "Smart Contract Developers", type: 'contributor-list', description: "Developers focused on smart contracts" },
  
  // Project Lists
  { id: "active-projects", name: "Active Projects", type: 'project-list', description: "Projects with commits in the last 30 days" },
  { id: "high-activity-projects", name: "High Activity Projects", type: 'project-list', description: "Projects with high commit frequency" },
  { id: "new-projects", name: "New Projects", type: 'project-list', description: "Projects created in the last 90 days" },
  { id: "ethereum-projects", name: "Ethereum Projects", type: 'project-list', description: "Projects in the Ethereum ecosystem" },
  { id: "solana-projects", name: "Solana Projects", type: 'project-list', description: "Projects in the Solana ecosystem" },
  { id: "polkadot-projects", name: "Polkadot Projects", type: 'project-list', description: "Projects in the Polkadot ecosystem" },
  { id: "near-projects", name: "NEAR Projects", type: 'project-list', description: "Projects in the NEAR ecosystem" },
  { id: "cosmos-projects", name: "Cosmos Projects", type: 'project-list', description: "Projects in the Cosmos ecosystem" },
  { id: "defi-projects", name: "DeFi Projects", type: 'project-list', description: "Decentralized Finance projects" },
  { id: "nft-projects", name: "NFT Projects", type: 'project-list', description: "NFT-related projects" },
];

interface DataSourceSelectorProps {
  onSourceChange: (sourceId: string) => void;
  className?: string;
}

export function DataSourceSelector({ onSourceChange, className = "" }: DataSourceSelectorProps) {
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedSourceData = dataSources.find(source => source.id === selectedSource);

  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    onSourceChange(value);
    setIsOpen(false);
  };

  // Initialize with default value
  useEffect(() => {
    onSourceChange(selectedSource);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter sources based on search query
  const filterSources = (sources: DataSource[], query: string) => {
    if (!query) return sources;
    
    const lowerCaseQuery = query.toLowerCase();
    return sources.filter(source => 
      source.name.toLowerCase().includes(lowerCaseQuery) || 
      (source.description && source.description.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const customSources = filterSources(dataSources.filter(source => source.type === 'custom'), searchQuery);
  const contributorSources = filterSources(dataSources.filter(source => source.type === 'contributor-list'), searchQuery);
  const projectSources = filterSources(dataSources.filter(source => source.type === 'project-list'), searchQuery);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Label htmlFor="data-source" className="text-sm font-medium">
          Filter By:
        </Label>
        {selectedSourceData?.description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{selectedSourceData.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[220px] justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedSourceData?.name || "Select list"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-[220px] rounded-md border bg-popover shadow-md">
            <div className="flex items-center px-3 py-2 border-b">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search lists..."
                className="h-8 w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-[300px] overflow-auto p-1">
              {customSources.length > 0 && (
                <div className="px-2 py-1.5 text-sm font-semibold">All Data</div>
              )}
              {customSources.map((source) => (
                <div
                  key={source.id}
                  className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                    selectedSource === source.id ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => handleSourceChange(source.id)}
                >
                  {source.name}
                </div>
              ))}
              
              {contributorSources.length > 0 && (
                <div className="px-2 py-1.5 text-sm font-semibold mt-1">Contributor Lists</div>
              )}
              {contributorSources.map((source) => (
                <div
                  key={source.id}
                  className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                    selectedSource === source.id ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => handleSourceChange(source.id)}
                >
                  {source.name}
                </div>
              ))}
              
              {projectSources.length > 0 && (
                <div className="px-2 py-1.5 text-sm font-semibold mt-1">Project Lists</div>
              )}
              {projectSources.map((source) => (
                <div
                  key={source.id}
                  className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                    selectedSource === source.id ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => handleSourceChange(source.id)}
                >
                  {source.name}
                </div>
              ))}
              
              {searchQuery && customSources.length === 0 && contributorSources.length === 0 && projectSources.length === 0 && (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No lists found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 