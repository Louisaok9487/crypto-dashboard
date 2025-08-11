import React from 'react';

interface FearGreedGaugeProps {
  value: number;
  lastUpdated: string;
}

const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ value, lastUpdated }) => {
    
    const getClassification = (val: number): string => {
        if (val <= 25) return 'Extreme Fear';
        if (val <= 45) return 'Fear';
        if (val <= 55) return 'Neutral';
        if (val <= 75) return 'Greed';
        return 'Extreme Greed';
    };

    const getClassificationColor = (classification: string): string => {
        switch (classification) {
            case 'Extreme Fear': return 'text-blue-600';
            case 'Fear': return 'text-blue-400';
            case 'Neutral': return 'text-gray-500';
            case 'Greed': return 'text-orange-500';
            case 'Extreme Greed': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const getValueBubbleColor = (val: number): string => {
        if (val <= 25) return 'bg-blue-600';
        if (val <= 45) return 'bg-blue-400';
        if (val <= 55) return 'bg-gray-400';
        if (val <= 75) return 'bg-orange-500';
        return 'bg-red-600';
    };

    const classificationText = getClassification(value);
    const classificationColorClass = getClassificationColor(classificationText);
    const bubbleColorClass = getValueBubbleColor(value);

    // SVG calculations
    const needleRotation = (value / 100) * 180 - 90;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col">
            <header className="flex items-center">
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3 shrink-0">B</div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Fear & Greed Index</h2>
                    <p className="text-sm text-gray-500">Multifactorial Crypto Market Sentiment Analysis</p>
                </div>
            </header>

            <div className="flex-grow flex flex-col items-center justify-center mt-6 mb-4">
                <div className="w-full max-w-xs relative">
                    {/* Gauge and Needle Container */}
                    <div className="relative">
                        <svg viewBox="0 0 100 55" className="w-full">
                            <defs>
                                <linearGradient id="gaugeGradientNew" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" /> 
                                    <stop offset="25%" stopColor="#60a5fa" />
                                    <stop offset="50%" stopColor="#9ca3af" />
                                    <stop offset="75%" stopColor="#f97316" />
                                    <stop offset="100%" stopColor="#ef4444" />
                                </linearGradient>
                            </defs>
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gaugeGradientNew)" strokeWidth="10" strokeLinecap="round" />
                            {/* Needle */}
                            <g style={{ transformOrigin: '50px 50px', transition: 'transform 0.7s ease-in-out', transform: `rotate(${needleRotation}deg)` }}>
                                <path d="M 50 50 L 50 12" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="3" fill="#4b5563" />
                            </g>
                        </svg>

                        {/* Value Bubble - absolutely positioned relative to the gauge container */}
                        <div className="absolute top-0 left-0 w-full h-full" 
                            style={{
                                transform: `rotate(${needleRotation}deg)`, 
                                transformOrigin: '50% 100%',
                                transition: 'transform 0.7s ease-in-out'
                            }}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${bubbleColorClass}`}
                                 style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    left: 'calc(50% - 24px)',
                                    transform: `rotate(${-needleRotation}deg)`,
                                    transformOrigin: '50% 50%'
                                 }}
                            >
                                {value}
                            </div>
                        </div>
                    </div>
                    {/* Classification Text */}
                    <div className="mt-4 text-center">
                        <p className="font-semibold text-gray-700">Now: <span className={`${classificationColorClass} font-bold`}>{classificationText}</span></p>
                    </div>
                </div>
            </div>

            <footer className="flex justify-between items-center text-sm text-gray-500 border-t pt-4 mt-auto">
                <span>alternative.me</span>
                <span>Last updated: {lastUpdated}</span>
            </footer>
        </div>
    );
};

export default FearGreedGauge;