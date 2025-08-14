import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SentimentChartProps {
  data: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [data.positive, data.negative, data.neutral],
        backgroundColor: [
          '#4caf50', // Green for positive
          '#f44336', // Red for negative
          '#ff9800', // Orange for neutral
        ],
        borderColor: [
          '#388e3c',
          '#d32f2f',
          '#f57c00',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SentimentChart;