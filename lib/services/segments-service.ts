import { getSegmentsStorage } from "@/lib/storage/segments-storage";

// Segment data types
export interface Segment {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    contributors?: string[];
    repositories?: string[];
}

// Segments service interface
export interface SegmentsService {
    getSegments(): Promise<Segment[]>;
    getSegment(id: string): Promise<Segment | undefined>;
    createSegment(segment: Omit<Segment, "id" | "created_at" | "updated_at">): Promise<Segment>;
    updateSegment(id: string, segment: Partial<Omit<Segment, "id" | "created_at" | "updated_at">>): Promise<Segment | undefined>;
    deleteSegment(id: string): Promise<boolean>;
    addContributorToSegment(segmentId: string, githubUserLogin: string): Promise<boolean>;
    removeContributorFromSegment(segmentId: string, githubUserLogin: string): Promise<boolean>;
    addRepositoryToSegment(segmentId: string, repositoryUrl: string): Promise<boolean>;
    removeRepositoryFromSegment(segmentId: string, repositoryUrl: string): Promise<boolean>;
}

// Real implementation using storage
export class SegmentsService implements SegmentsService {
    async getSegments(): Promise<Segment[]> {
        const storage = getSegmentsStorage();
        return storage.getSegments();
    }

    async getSegment(id: string): Promise<Segment | undefined> {
        const storage = getSegmentsStorage();
        return storage.getSegment(id);
    }

    async createSegment(segment: Omit<Segment, "id" | "created_at" | "updated_at">): Promise<Segment> {
        const storage = getSegmentsStorage();
        return storage.createSegment(segment);
    }

    async updateSegment(id: string, segment: Partial<Omit<Segment, "id" | "created_at" | "updated_at">>): Promise<Segment | undefined> {
        const storage = getSegmentsStorage();
        return storage.updateSegment(id, segment);
    }

    async deleteSegment(id: string): Promise<boolean> {
        const storage = getSegmentsStorage();
        return storage.deleteSegment(id);
    }

    async addContributorToSegment(segmentId: string, githubUserLogin: string): Promise<boolean> {
        const storage = getSegmentsStorage();
        return storage.addContributorToSegment(segmentId, githubUserLogin);
    }

    async removeContributorFromSegment(segmentId: string, githubUserLogin: string): Promise<boolean> {
        const storage = getSegmentsStorage();
        return storage.removeContributorFromSegment(segmentId, githubUserLogin);
    }

    async addRepositoryToSegment(segmentId: string, repositoryUrl: string): Promise<boolean> {
        const storage = getSegmentsStorage();
        return storage.addRepositoryToSegment(segmentId, repositoryUrl);
    }

    async removeRepositoryFromSegment(segmentId: string, repositoryUrl: string): Promise<boolean> {
        const storage = getSegmentsStorage();
        return storage.removeRepositoryFromSegment(segmentId, repositoryUrl);
    }
}

// Create a singleton instance of the service
const segmentsService: SegmentsService =
    process.env.NODE_ENV === "production" ? new SegmentsService() : new SegmentsService();

// Export functions that use the service
export async function getSegments(): Promise<Segment[]> {
    return segmentsService.getSegments();
}

export async function getSegment(id: string): Promise<Segment | undefined> {
    return segmentsService.getSegment(id);
}

export async function createSegment(segment: Omit<Segment, "id" | "created_at" | "updated_at">): Promise<Segment> {
    return segmentsService.createSegment(segment);
}

export async function updateSegment(
    id: string,
    segment: Partial<Omit<Segment, "id" | "created_at" | "updated_at">>
): Promise<Segment | undefined> {
    return segmentsService.updateSegment(id, segment);
}

export async function deleteSegment(id: string): Promise<boolean> {
    return segmentsService.deleteSegment(id);
}

export async function addContributorToSegment(segmentId: string, githubUserLogin: string): Promise<boolean> {
    return segmentsService.addContributorToSegment(segmentId, githubUserLogin);
}

export async function removeContributorFromSegment(segmentId: string, githubUserLogin: string): Promise<boolean> {
    return segmentsService.removeContributorFromSegment(segmentId, githubUserLogin);
}

export async function addRepositoryToSegment(segmentId: string, repositoryUrl: string): Promise<boolean> {
    return segmentsService.addRepositoryToSegment(segmentId, repositoryUrl);
}

export async function removeRepositoryFromSegment(segmentId: string, repositoryUrl: string): Promise<boolean> {
    return segmentsService.removeRepositoryFromSegment(segmentId, repositoryUrl);
}