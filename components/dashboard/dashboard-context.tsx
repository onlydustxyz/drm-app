"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface DashboardContextProps {
	sourceId: string;
	setSourceId: (sourceId: string) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

interface DashboardProviderProps {
	children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
	const [sourceId, setSourceId] = useState<string>("all");

	return <DashboardContext.Provider value={{ sourceId, setSourceId }}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
	const context = useContext(DashboardContext);
	if (context === undefined) {
		throw new Error("useDashboardContext must be used within a DashboardProvider");
	}
	return context;
}

// Helper function to filter data based on source
export function filterDataBySource<T>(data: T[], sourceId: string): T[] {
	// For demo purposes, we're just returning the original data
	// In a real app, you would filter the data based on the sourceId
	return data;
}

// Helper function to scale KPIs based on source
export function scaleDataBySource<T>(data: T, sourceId: string, scalingFactors: { [key: string]: number } = {}): T {
	if (sourceId === "all") return data;

	// Default scaling factors if none provided
	const defaultFactors: { [key: string]: number } = {
		// Contributor lists
		"active-contributors": 0.85,
		"full-time-devs": 0.45,
		"top-contributors": 0.25,
		"new-contributors": 0.15,
		"project-leads": 0.08,
		"community-contributors": 0.75,
		"backend-devs": 0.35,
		"frontend-devs": 0.4,
		"contract-devs": 0.2,

		// Project lists
		"active-projects": 0.7,
		"high-activity-projects": 0.4,
		"new-projects": 0.2,
		"ethereum-projects": 0.45,
		"solana-projects": 0.25,
		"polkadot-projects": 0.15,
		"near-projects": 0.1,
		"cosmos-projects": 0.12,
		"defi-projects": 0.3,
		"nft-projects": 0.18,
	};

	const factors = Object.keys(scalingFactors).length > 0 ? scalingFactors : defaultFactors;
	const factor = factors[sourceId] || 1;

	// Apply scaling factor - this is just for demo purposes
	// In real applications, you would handle this according to your data structure
	return data;
}
