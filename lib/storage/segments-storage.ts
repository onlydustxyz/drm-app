import { Segment } from "@/lib/services/segments-service";
import { DrizzleSegmentsStorage } from "@/lib/storage/adapters/segments-storage-drizzle";

/**
 * Interface for accessing segments data from storage
 */
export interface SegmentsStorage {
    getSegments(): Promise<Segment[]>;
    getSegment(id: string): Promise<Segment | undefined>;
    createSegment(segment: Omit<Segment, "id" | "created_at" | "updated_at">): Promise<Segment>;
    updateSegment(id: string, segment: Partial<Omit<Segment, "id" | "created_at" | "updated_at">>): Promise<Segment | undefined>;
    deleteSegment(id: string): Promise<boolean>;
    addContributorToSegment(segmentId: string, contributorId: string): Promise<boolean>;
    removeContributorFromSegment(segmentId: string, contributorId: string): Promise<boolean>;
    addRepositoryToSegment(segmentId: string, repositoryUrl: string): Promise<boolean>;
    removeRepositoryFromSegment(segmentId: string, repositoryUrl: string): Promise<boolean>;
}

// Create a singleton instance that will be used throughout the application
let segmentsStorage: SegmentsStorage;

// Initialize with the drizzle implementation if we're in a server context
if (typeof window === "undefined") {
    segmentsStorage = new DrizzleSegmentsStorage();
} else {
    // This would be initialized during SSR and hydration would make it available on the client
    // For now we'll throw an error in case someone tries to access it on the client directly
    segmentsStorage = new Proxy({} as SegmentsStorage, {
        get: () => {
            throw new Error("SegmentsStorage is only available on the server");
        },
    });
}

export function getSegmentsStorage(): SegmentsStorage {
    return segmentsStorage;
}

export function setSegmentsStorage(storage: SegmentsStorage): void {
    segmentsStorage = storage;
} 