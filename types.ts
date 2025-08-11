export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
  metadata: {
    error: string | null;
  };
}

export interface HistoricalData {
  now: FearGreedData;
  yesterday: FearGreedData;
  lastWeek: FearGreedData;
  lastMonth: FearGreedData;
}

export interface BitcoinPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: string;
  price_usd: string;
  price_btc: string;
  '24h_volume_usd': string;
  market_cap_usd: string;
  available_supply: string;
  total_supply: string;
  max_supply: string;
  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  last_updated: string;
}

export interface NewsArticle {
    title: string;
    uri: string;
    published_on: number;
}

export type HistoricalPricePoint = [number, number]; // [timestamp, price]
