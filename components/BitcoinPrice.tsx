import React from 'react';
import type { BitcoinPriceData } from '../types';

interface BitcoinPriceProps {
    priceData: BitcoinPriceData;
}

const BitcoinPrice: React.FC<BitcoinPriceProps> = ({ priceData }) => {
    const price = parseFloat(priceData.price_usd);
    const change24h = parseFloat(priceData.percent_change_24h);

    const isPositive = change24h >= 0;

    const formattedPrice = price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
    const bgColor = isPositive ? 'bg-green-100' : 'bg-red-100';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" alt="Bitcoin logo" className="w-10 h-10 mr-3"/>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Bitcoin (BTC)</h2>
                        <p className="text-sm text-gray-500">Current Price</p>
                    </div>
                </div>
            </div>
            <div className="text-left">
                <p className="text-3xl font-bold text-gray-900">{formattedPrice}</p>
                <div className={`mt-2 flex items-center text-lg font-semibold ${changeColor}`}>
                    {isPositive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 17a1 1 0 01-1-1V4.414l-3.293 3.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 4.414V16a1 1 0 01-1 1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v11.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span>{change24h.toFixed(2)}%</span>
                    <span className="text-sm text-gray-500 ml-2">(24h)</span>
                </div>
            </div>
        </div>
    );
};

export default BitcoinPrice;
