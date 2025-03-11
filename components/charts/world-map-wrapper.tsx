"use client";

import { DevelopersByCountry } from "@/lib/dashboard-service";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the WorldMapChart component with no SSR
// This is necessary because Highcharts requires the window object
const WorldMapChart = dynamic(
  () => import("./world-map-chart").then((mod) => mod.WorldMapChart),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[400px]">Loading map...</div> }
);

interface WorldMapWrapperProps {
  data: DevelopersByCountry[];
}

export function WorldMapWrapper({ data }: WorldMapWrapperProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[400px]">Loading map...</div>}>
      <WorldMapChart data={data} />
    </Suspense>
  );
} 