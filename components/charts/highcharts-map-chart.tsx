"use client";

import { DevelopersByCountry } from "@/lib/dashboard-service";
import { useEffect, useState } from "react";
import { getWorldMapData } from "@/lib/world-map";

// TypeScript declaration for global Highcharts
declare global {
  interface Window {
    Highcharts: any;
  }
}

interface HighchartsMapChartProps {
  data: DevelopersByCountry[];
}

export function HighchartsMapChart({ data }: HighchartsMapChartProps) {
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to load scripts in sequence
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        
        document.head.appendChild(script);
      });
    };

    const initializeChart = async () => {
      try {
        setIsLoading(true);
        
        // Load Highcharts scripts from CDN in sequence
        await loadScript('https://code.highcharts.com/highcharts.js');
        await loadScript('https://code.highcharts.com/maps/modules/map.js');
        
        // Load the map data
        const mapData = await getWorldMapData();
        
        // Format data for Highcharts
        const formattedData = data.map(country => ({
          "hc-key": country.code,
          value: country.value,
          name: country.name
        }));

        // Create chart options
        // Access Highcharts from the global window object
        const options = {
          chart: {
            map: mapData,
            backgroundColor: 'transparent',
            height: '400px'
          },
          title: {
            text: undefined
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              alignTo: 'spacingBox'
            }
          },
          colorAxis: {
            min: 0,
            stops: [
              [0, '#EEEEFF'],
              [0.5, '#4F46E5'],
              [1, '#312E81']
            ]
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'bottom'
          },
          series: [{
            type: 'map',
            name: 'Developers',
            states: {
              hover: {
                color: '#a4edba'
              }
            },
            dataLabels: {
              enabled: false,
              format: '{point.name}'
            },
            allAreas: true,
            data: formattedData
          }],
          tooltip: {
            headerFormat: '',
            pointFormat: '{point.name}: <b>{point.value}</b> developers'
          },
          credits: {
            enabled: false
          }
        };
        
        setChartOptions(options);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing chart:', error);
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      initializeChart();
    }
  }, [data]);
  
  // Function to render the chart using the global Highcharts object
  useEffect(() => {
    if (isLoading || typeof window === 'undefined' || !window.Highcharts) return;
    
    // Clear any existing chart
    const chartContainer = document.getElementById('map-chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = '';
      
      // Create the chart using the global Highcharts object
      window.Highcharts.mapChart('map-chart-container', chartOptions);
    }
  }, [chartOptions, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading map data...</div>;
  }

  return <div id="map-chart-container" className="w-full h-full"></div>;
} 