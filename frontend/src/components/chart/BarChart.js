import React, { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({
  labels = [],
  datasets = [{ label: '', backgroundColor: '', data: [] }],
  titleChart,
}) {
  const dataDisplay = useMemo(() => {
    const datasetBase = {
      backgroundColor: '#6F49FD',
      data: [],
      label: '',
      categoryPercentage: 0.2,
      maxBarThickness: 50,
    };
    return {
      labels,
      datasets: datasets.map((dataset) => ({ ...datasetBase, ...dataset })),
    };
  }, [datasets, labels]);
  return (
    <Bar
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: titleChart,
          },
        },
        elements: { bar: { borderRadius: 4 } },
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

export default memo(BarChart);
