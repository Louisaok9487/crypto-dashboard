
import React from 'react';
import type { FearGreedData } from '../types';

interface HistoricalValuesProps {
  data: {
    now: FearGreedData;
    yesterday: FearGreedData;
    lastWeek: FearGreedData;
    lastMonth: FearGreedData;
  };
}

const getClassificationColor = (classification: string) => {
  switch (classification) {
    case 'Extreme Fear': return 'text-blue-600';
    case 'Fear': return 'text-blue-400';
    case 'Neutral': return 'text-gray-500';
    case 'Greed': return 'text-orange-500';
    case 'Extreme Greed': return 'text-red-600';
    default: return 'text-gray-500';
  }
};

const getValuePillColor = (value: number) => {
  if (value <= 25) return 'bg-blue-600';
  if (value <= 45) return 'bg-blue-400';
  if (value <= 55) return 'bg-gray-400';
  if (value <= 75) return 'bg-orange-500';
  return 'bg-red-600';
};

const ValuePill: React.FC<{ value: string }> = ({ value }) => (
  <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg ${getValuePillColor(parseInt(value))}`}>
    {value}
  </div>
);

const HistoricalItem: React.FC<{ label: string; data: FearGreedData }> = ({ label, data }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
    <div>
      <p className="text-gray-500">{label}</p>
      <p className={`font-semibold text-lg ${getClassificationColor(data.value_classification)}`}>{data.value_classification}</p>
    </div>
    <ValuePill value={data.value} />
  </div>
);

const HistoricalValues: React.FC<HistoricalValuesProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Historical Values</h2>
      <div className="flex-grow flex flex-col justify-between">
        <HistoricalItem label="Now" data={data.now} />
        <HistoricalItem label="Yesterday" data={data.yesterday} />
        <HistoricalItem label="Last week" data={data.lastWeek} />
        <HistoricalItem label="Last month" data={data.lastMonth} />
      </div>
    </div>
  );
};

export default HistoricalValues;
