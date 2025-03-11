"use client";

import { DevelopersByCountry } from "@/lib/dashboard-service";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Define the props interface
interface WorldMapChartProps {
  data: DevelopersByCountry[];
}

// Create the component
export function WorldMapChart({ data }: WorldMapChartProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Use useEffect to ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render the chart on the client side
  if (!isClient) {
    return <div className="flex items-center justify-center h-full">Loading map...</div>;
  }

  // Dynamically import the actual chart component
  const HighchartsMapChart = dynamic(
    () => import("./highcharts-map-chart").then((mod) => mod.HighchartsMapChart),
    { ssr: false, loading: () => <div>Loading map...</div> }
  );

  return <HighchartsMapChart data={data} />;
}

// Default export for dynamic import
export default { WorldMapChart }; 