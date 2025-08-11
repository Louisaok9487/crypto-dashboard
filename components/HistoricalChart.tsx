import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import type { FearGreedData, HistoricalPricePoint } from '../types';
import { fetchBitcoinHistoricalPrice } from '../services/fearGreedService';
import Spinner from './Spinner';

Chart.register(...registerables);

interface HistoricalChartProps {
  data: FearGreedData[];
}

const TimeframeSelector: React.FC<{
  selected: number;
  onSelect: (days: number) => void;
  disabled: boolean;
}> = ({ selected, onSelect, disabled }) => {
  const timeframes = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
  ];

  return (
    <div className="flex items-center space-x-2">
      {timeframes.map(({ label, days }) => (
        <button
          key={days}
          onClick={() => onSelect(days)}
          disabled={disabled}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            selected === days
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};


const HistoricalChart: React.FC<HistoricalChartProps> = ({ data: fngData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [activeTimeframe, setActiveTimeframe] = useState(30);
  const [priceData, setPriceData] = useState<HistoricalPricePoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const getPriceData = async () => {
        setIsLoading(true);
        setError(null);
        setPriceData(null);
        try {
            const prices = await fetchBitcoinHistoricalPrice(activeTimeframe);
            setPriceData(prices);
        } catch (err) {
            setError('Failed to fetch price history. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    getPriceData();
  }, [activeTimeframe]);

  useEffect(() => {
    if (!chartRef.current || !priceData || !fngData || fngData.length === 0) {
      // Destroy chart if data is not available (e.g., during loading)
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      return;
    };

    const fngMap = new Map<string, number>();
    fngData.forEach(d => {
        const date = new Date(parseInt(d.timestamp) * 1000);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        fngMap.set(dateKey, parseInt(d.value));
    });
    
    const labels = priceData.map(p => {
        const date = new Date(p[0]);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const btcPriceValues = priceData.map(p => p[1]);
    
    const fngValues = priceData.map(p => {
        const date = new Date(p[0]);
        const dateKey = date.toISOString().split('T')[0];
        return fngMap.get(dateKey) || null;
    });


    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Bitcoin Price (USD)',
            data: btcPriceValues,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'yPrice',
            pointRadius: 0,
            pointHitRadius: 10,
            fill: true,
          },
          {
            label: 'Fear & Greed Index',
            data: fngValues,
            borderColor: '#4b5563',
            borderWidth: 2.5,
            tension: 0.3,
            yAxisID: 'yFng',
            pointRadius: 0,
            pointHitRadius: 10,
            fill: false,
            spanGaps: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
                boxWidth: 12,
                padding: 20,
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    if (context.dataset.yAxisID === 'yPrice') {
                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                    } else {
                        label += context.parsed.y;
                    }
                }
                return label;
              }
            }
          },
        },
        scales: {
          x: { 
            grid: { display: false } ,
            ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 10
            }
          },
          yPrice: {
            type: 'linear',
            position: 'left',
            grid: { color: '#e5e7eb' },
            ticks: {
                callback: (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value as number),
                color: '#6b7280'
            }
          },
          yFng: {
            display: false, // Hides the axis labels and ticks
            type: 'linear',
            position: 'right',
            min: 0,
            max: 100,
            grid: { display: false },
          },
        },
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [priceData, fngData]);

  return (
    <div className="w-full h-full">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Market Analysis: Price vs. Sentiment</h2>
            <TimeframeSelector selected={activeTimeframe} onSelect={setActiveTimeframe} disabled={isLoading} />
        </div>
        <div className="relative h-96">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <Spinner />
              </div>
            )}
            {!isLoading && error && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <canvas ref={chartRef}></canvas>
        </div>
    </div>
  );
};

export default HistoricalChart;