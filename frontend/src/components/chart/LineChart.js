import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

function LineChart({
  labels = [],
  datasets = [{ label: '', data: [], backgroundColor: '', borderColor: '' }],
}) {
  const dataDisplay = useMemo(() => {
    const datasetBase = {
      borderWidth: 1,
      pointRadius: 5,
      borderCapStyle: 'round',
      backgroundColor: '#6F49FD',
      borderColor: '#6F49FD',
    };
    return {
      labels,
      datasets: datasets.map((dataset) => ({ ...datasetBase, ...dataset })),
    };
  }, [datasets, labels]);

  return (
    <Line
      options={{
        ...options,
        elements: { line: { tension: 0.2 } },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
        },
      }}
      data={dataDisplay}
    />
  );
}

export default LineChart;
