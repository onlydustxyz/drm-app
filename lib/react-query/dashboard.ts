import {useQuery} from "@tanstack/react-query";
import {
    CommitsByDevType,
    DashboardKPI,
    DevActivity,
    DeveloperActivity,
    MonthlyCommits,
    MonthlyPRsMerged
} from "@/lib/services/dashboard-service";

// Query keys for dashboard
export const dashboardKeys = {
    all: ["dashboard"] as const,
    kpis: () => [...dashboardKeys.all, "kpis"] as const,
    developerActivity: () => [...dashboardKeys.all, "developerActivity"] as const,
    devActivity: () => [...dashboardKeys.all, "devActivity"] as const,
    commitsByDevType: () => [...dashboardKeys.all, "commitsByDevType"] as const,
    monthlyCommits: () => [...dashboardKeys.all, "monthlyCommits"] as const,
    monthlyPRsMerged: () => [...dashboardKeys.all, "monthlyPRsMerged"] as const,
};

async function fetchDashboardKPIs(): Promise<DashboardKPI> {
    const response = await fetch("/api/dashboard/kpis");
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard KPIs");
    }
    return response.json();
}

async function fetchDeveloperActivity(): Promise<DeveloperActivity[]> {
    const response = await fetch("/api/dashboard/developer-activity");
    if (!response.ok) {
        throw new Error("Failed to fetch developer activity");
    }
    return response.json();
}

async function fetchDevActivity(): Promise<DevActivity[]> {
    const response = await fetch("/api/dashboard/dev-activity");
    if (!response.ok) {
        throw new Error("Failed to fetch dev activity");
    }
    return response.json();
}

async function fetchCommitsByDevType(): Promise<CommitsByDevType[]> {
    const response = await fetch("/api/dashboard/commits-by-dev-type");
    if (!response.ok) {
        throw new Error("Failed to fetch commits by dev type");
    }
    return response.json();
}

async function fetchMonthlyCommits(): Promise<MonthlyCommits[]> {
    const response = await fetch("/api/dashboard/monthly-commits");
    if (!response.ok) {
        throw new Error("Failed to fetch monthly commits");
    }
    return response.json();
}

async function fetchMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]> {
    const response = await fetch("/api/dashboard/monthly-prs-merged");
    if (!response.ok) {
        throw new Error("Failed to fetch monthly PRs merged");
    }
    return response.json();
}

export function useDashboardKPIs() {
    return useQuery({
        queryKey: dashboardKeys.kpis(),
        queryFn: fetchDashboardKPIs,
    });
}

export function useDeveloperActivity() {
    return useQuery({
        queryKey: dashboardKeys.developerActivity(),
        queryFn: fetchDeveloperActivity,
    });
}

export function useDevActivity() {
    return useQuery({
        queryKey: dashboardKeys.devActivity(),
        queryFn: fetchDevActivity,
    });
}

export function useCommitsByDevType() {
    return useQuery({
        queryKey: dashboardKeys.commitsByDevType(),
        queryFn: fetchCommitsByDevType,
    });
}

export function useMonthlyCommits() {
    return useQuery({
        queryKey: dashboardKeys.monthlyCommits(),
        queryFn: fetchMonthlyCommits,
    });
}

export function useMonthlyPRsMerged() {
    return useQuery({
        queryKey: dashboardKeys.monthlyPRsMerged(),
        queryFn: fetchMonthlyPRsMerged,
    });
}