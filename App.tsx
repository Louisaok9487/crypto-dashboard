
import React, { useState, useEffect, useCallback } from 'react';
import type { HistoricalData, FearGreedData, BitcoinPriceData, NewsArticle } from './types';
import { fetchFearGreedIndex, fetchBitcoinPrice, fetchBitcoinNews, NEWS_ARTICLES_PER_PAGE } from './services/fearGreedService';
import FearGreedGauge from './components/FearGreedGauge';
import HistoricalValues from './components/HistoricalValues';
import Spinner from './components/Spinner';
import HistoricalChart from './components/HistoricalChart';
import BitcoinPrice from './components/BitcoinPrice';
import BitcoinNews from './components/BitcoinNews';


const App: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [fullHistory, setFullHistory] = useState<FearGreedData[]>([]);
  const [bitcoinPrice, setBitcoinPrice] = useState<BitcoinPriceData | null>(null);
  const [bitcoinNews, setBitcoinNews] = useState<NewsArticle[]>([]);
  const [newsPage, setNewsPage] = useState(1);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fngResponse, priceResponse, newsResponse] = await Promise.all([
        fetchFearGreedIndex(),
        fetchBitcoinPrice(),
        fetchBitcoinNews(1)
      ]);

      if (fngResponse.data && fngResponse.data.length >= 31) {
        setHistoricalData({
          now: fngResponse.data[0],
          yesterday: fngResponse.data[1],
          lastWeek: fngResponse.data[7],
          lastMonth: fngResponse.data[30],
        });
        setFullHistory(fngResponse.data);
      } else {
        throw new Error("Not enough Fear & Greed data available.");
      }
      
      if (priceResponse) {
        setBitcoinPrice(priceResponse);
      } else {
        throw new Error("Could not fetch Bitcoin price.");
      }

      setBitcoinNews(newsResponse);
      setNewsPage(1);

    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to fetch data. ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const handleNewsPageChange = async (newPage: number) => {
    if (newPage < 1) return;
    setIsNewsLoading(true);
    // Do not set global error, let user see existing data while new page loads
    try {
      const newsResponse = await fetchBitcoinNews(newPage);
      setBitcoinNews(newsResponse);
      setNewsPage(newPage);
    } catch (err) {
       const message = err instanceof Error ? err.message : "An unknown error occurred.";
       // Set global error if pagination fails
       setError(`Failed to fetch news. ${message}`);
       console.error(err);
    } finally {
      setIsNewsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Crypto Sentiment Dashboard</h1>
            <p className="text-gray-600 mt-2">
              A comprehensive overview of Bitcoin market sentiment, price, and news.
            </p>
          </div>
        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Spinner />
              <p className="mt-4 text-gray-600">Fetching dashboard data...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
              <p className="font-semibold text-lg">{error}</p>
              <button onClick={getInitialData} className="mt-4 px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors shadow">
                Try Again
              </button>
            </div>
          ) : historicalData && bitcoinPrice ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Left Column Group - takes 3/5 width on lg screens */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <BitcoinPrice priceData={bitcoinPrice} />
                  <FearGreedGauge 
                    value={parseInt(historicalData.now.value)}
                    lastUpdated={formatTimestamp(historicalData.now.timestamp)}
                  />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  {fullHistory.length > 0 ? (
                    <HistoricalChart data={fullHistory} />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center">
                      <p className="text-gray-500">Historical data not available.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column Group - takes 2/5 width on lg screens */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <HistoricalValues data={historicalData} />
                <BitcoinNews 
                  articles={bitcoinNews}
                  currentPage={newsPage}
                  isLoading={isNewsLoading}
                  onPageChange={handleNewsPageChange}
                  articlesPerPage={NEWS_ARTICLES_PER_PAGE}
                />
              </div>

            </div>
          ) : null}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
           <p>
             F&G Index data provided by <a href="https://alternative.me/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">alternative.me</a>.
             Price data by <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CoinGecko</a>.
           </p>
           <p>News provided by <a href="https://min-api.cryptocompare.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CryptoCompare</a>.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
