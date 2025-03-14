import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';

const RepositoryActivityHeatmap = ({ data }) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const repoNames = data.map((repo) => repo.repositoryName);
  const heatmapData = data.map((repo) => repo.monthlyActivity);

  return (
    <div>
      <h2>Repository Activity Heatmap</h2>
      <HeatMapGrid
        data={heatmapData}
        xLabels={months}
        yLabels={repoNames}
        cellRender={(x, y, value) => `${value} commits`}
        cellStyle={(x, y, ratio) => ({
          background: `rgba(0, 255, 0, ${ratio})`,
          fontSize: '.8rem',
        })}
      />
    </div>
  );
};

export default RepositoryActivityHeatmap;
