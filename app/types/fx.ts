export type FxMarketType = "fiat" | "stable";

export interface FxQuote {
  pair: string;
  marketType: FxMarketType;
  rate: number;
  change24h: number;
  updatedAt: string;
}

export interface FxRatesResponse {
  base: string;
  quotes: FxQuote[];
  fetchedAt: string;
}
