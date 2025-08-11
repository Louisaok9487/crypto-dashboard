import type { FearGreedResponse, BitcoinPriceData, NewsArticle, HistoricalPricePoint } from '../types';

const COINGECKO_BTC_PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true';
const COINGECKO_BTC_HISTORY_API_URL = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';

export const NEWS_ARTICLES_PER_PAGE = 5;
const NEWS_API_URL_BASE = `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=BTC&limit=${NEWS_ARTICLES_PER_PAGE}`;


export const fetchFearGreedIndex = async (limit: number = 91): Promise<FearGreedResponse> => {
  try {
    const response = await fetch(`https://api.alternative.me/fng/?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: FearGreedResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Fear & Greed Index:", error);
    throw error;
  }
};

export const fetchBitcoinHistoricalPrice = async (days: number): Promise<HistoricalPricePoint[]> => {
    try {
        const response = await fetch(`${COINGECKO_BTC_HISTORY_API_URL}?vs_currency=usd&days=${days}&interval=daily`);
        if (!response.ok) {
            throw new Error(`Coingecko history API error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.prices || !Array.isArray(data.prices)) {
            throw new Error('Invalid data format from Coingecko history API');
        }
        // The last data point from coingecko for daily can be for tomorrow, with price 0. Filter it out.
        return data.prices.filter((p: HistoricalPricePoint) => p[1] > 0);
    } catch (error) {
        console.error("Error fetching Bitcoin historical price:", error);
        throw error;
    }
}

export const fetchBitcoinPrice = async (): Promise<BitcoinPriceData> => {
    try {
        const response = await fetch(COINGECKO_BTC_PRICE_API_URL);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const bitcoinData = data.bitcoin;
        if (!bitcoinData || typeof bitcoinData.usd === 'undefined' || typeof bitcoinData.usd_24h_change === 'undefined') {
            throw new Error("Invalid data format from Coingecko API");
        }

        const mappedData: BitcoinPriceData = {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            price_usd: bitcoinData.usd.toString(),
            percent_change_24h: bitcoinData.usd_24h_change.toString(),
            // --- Unused properties, filled with defaults ---
            rank: '1',
            price_btc: '1',
            '24h_volume_usd': '0',
            market_cap_usd: '0',
            available_supply: '0',
            total_supply: '0',
            max_supply: '0',
            percent_change_1h: '0',
            percent_change_7d: '0',
            last_updated: Date.now().toString(),
        };

        return mappedData;
    } catch (error) {
        console.error("Error fetching Bitcoin price from Coingecko:", error);
        throw error;
    }
};

export const fetchBitcoinNews = async (page: number = 1): Promise<NewsArticle[]> => {
    try {
        const response = await fetch(`${NEWS_API_URL_BASE}&page=${page}`);
        if (!response.ok) {
            throw new Error(`News API request failed with status: ${response.status}`);
        }
        const apiResponse = await response.json();

        if (apiResponse.Type !== 100 || !Array.isArray(apiResponse.Data)) {
            throw new Error('Invalid data format from news API');
        }

        const articles: NewsArticle[] = apiResponse.Data.map((article: any) => ({
            title: article.title,
            uri: article.url,
            published_on: article.published_on,
        }));

        return articles;
    } catch (error) {
        console.error("Error fetching Bitcoin news from CryptoCompare:", error);
        throw error; // Re-throw to be handled by the caller in App.tsx
    }
};