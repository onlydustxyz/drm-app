// This is a simplified version of the world map data for Highcharts
// The full version can be found in the Highcharts map collection

// For client-side usage, we'll need to handle this differently
// since we can't directly import JSON files in Next.js client components

// This function will be used to load the map data at runtime
export async function getWorldMapData() {
  try {
    // Use absolute URL to ensure it works in all environments
    const response = await fetch('/world-map.json');
    if (!response.ok) {
      throw new Error(`Failed to load map data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load world map data:', error);
    // Return an empty map structure to prevent rendering errors
    return {
      type: "FeatureCollection",
      features: []
    };
  }
} 