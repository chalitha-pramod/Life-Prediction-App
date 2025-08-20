import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import whoApi from '../services/whoApi';
import './GlobalStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GlobalStats = () => {
  const [globalData, setGlobalData] = useState(null);
  const [regionalData, setRegionalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      const [globalStats, regionalStats] = await Promise.all([
        whoApi.getGlobalLifeExpectancyStats(),
        whoApi.getLifeExpectancyByRegion()
      ]);

      setGlobalData(globalStats);
      setRegionalData(regionalStats);
    } catch (err) {
      setError('Failed to fetch global statistics. Using sample data instead.');
      // Fallback to sample data
      setGlobalData(getSampleGlobalData());
      setRegionalData(getSampleRegionalData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleGlobalData = () => {
    return [
      { CountryName: 'Japan', Value: 84.7, TimeDimensionValue: '2020' },
      { CountryName: 'Switzerland', Value: 83.8, TimeDimensionValue: '2020' },
      { CountryName: 'Australia', Value: 83.2, TimeDimensionValue: '2020' },
      { CountryName: 'Spain', Value: 83.1, TimeDimensionValue: '2020' },
      { CountryName: 'Italy', Value: 82.9, TimeDimensionValue: '2020' },
      { CountryName: 'France', Value: 82.7, TimeDimensionValue: '2020' },
      { CountryName: 'Canada', Value: 82.4, TimeDimensionValue: '2020' },
      { CountryName: 'United Kingdom', Value: 81.2, TimeDimensionValue: '2020' },
      { CountryName: 'United States', Value: 78.9, TimeDimensionValue: '2020' },
      { CountryName: 'China', Value: 76.9, TimeDimensionValue: '2020' }
    ];
  };

  const getSampleRegionalData = () => {
    return {
      'Europe': { average: 81.2, count: 44, countries: [] },
      'Americas': { average: 76.8, count: 35, countries: [] },
      'Western Pacific': { average: 77.8, count: 37, countries: [] },
      'South-East Asia': { average: 71.4, count: 11, countries: [] },
      'Eastern Mediterranean': { average: 72.8, count: 21, countries: [] },
      'Africa': { average: 64.1, count: 47, countries: [] }
    };
  };

  const prepareChartData = (data) => {
    if (!data || data.length === 0) return null;

    const sortedData = data
      .filter(item => item.Value && item.CountryName)
      .sort((a, b) => parseFloat(b.Value) - parseFloat(a.Value))
      .slice(0, 10);

    return {
      labels: sortedData.map(item => item.CountryName),
      datasets: [
        {
          label: 'Life Expectancy (years)',
          data: sortedData.map(item => parseFloat(item.Value)),
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 Countries by Life Expectancy'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 60,
        max: 90
      }
    }
  };

  if (loading) {
    return (
      <div className="global-stats-container">
        <div className="loading">Loading global statistics...</div>
      </div>
    );
  }

  return (
    <div className="global-stats-container">
      <h2>Global Life Expectancy Statistics</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="chart-section">
          <h3>Top Countries by Life Expectancy</h3>
          <div className="chart-container">
            {globalData && (
              <Line data={prepareChartData(globalData)} options={chartOptions} />
            )}
          </div>
        </div>

        <div className="regional-section">
          <h3>Regional Averages</h3>
          <div className="regional-grid">
            {regionalData && Object.entries(regionalData).map(([region, data]) => (
              <div key={region} className="regional-card">
                <div className="regional-name">{region}</div>
                <div className="regional-average">{data.average.toFixed(1)} years</div>
                <div className="regional-count">{data.count} countries</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="data-info">
        <p>
          <strong>Source:</strong> World Health Organization (WHO) Global Health Observatory
        </p>
        <p>
          <strong>Note:</strong> Data represents life expectancy at birth for the most recent available year.
        </p>
      </div>
    </div>
  );
};

export default GlobalStats;
