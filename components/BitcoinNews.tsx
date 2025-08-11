
import React from 'react';
import type { NewsArticle } from '../types';
import Spinner from './Spinner';

interface BitcoinNewsProps {
  articles: NewsArticle[];
  currentPage: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  articlesPerPage: number;
}

const BitcoinNews: React.FC<BitcoinNewsProps> = ({ articles, currentPage, isLoading, onPageChange, articlesPerPage }) => {

  const formatTimeAgo = (timestamp: number): string => {
    const now = new Date();
    const articleDate = new Date(timestamp * 1000);
    const seconds = Math.floor((now.getTime() - articleDate.getTime()) / 1000);

    if (seconds < 60) return `Just now`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  const hasNextPage = articles.length === articlesPerPage;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest News</h2>
      <div className="relative flex-grow overflow-y-auto pr-2 min-h-0">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
          </div>
        )}
        {articles.length > 0 ? (
          <div className="space-y-3">
            {articles.map((article, index) => (
              <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                <a 
                  href={article.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 transition-colors group"
                >
                  <p className="font-semibold text-gray-800 group-hover:text-blue-800">{article.title}</p>
                </a>
                 <p className="text-sm text-gray-500">{formatTimeAgo(article.published_on)}</p>
              </div>
            ))}
          </div>
        ) : (
           !isLoading && (
            <div className="flex items-center justify-center h-full">
               <p className="text-gray-500">No news articles available.</p>
            </div>
           )
        )}
      </div>
      <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage || isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Previous
          </button>
          <span className="text-gray-600 font-semibold">Page {currentPage}</span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Next
          </button>
      </div>
    </div>
  );
};

export default BitcoinNews;
