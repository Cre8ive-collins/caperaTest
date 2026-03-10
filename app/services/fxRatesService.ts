import type { FxQuote, FxRatesResponse } from "~/types/fx";

const TRACKED_PAIRS: Array<{ pair: string; marketType: FxQuote["marketType"] }> = [
  { pair: "NGN/USD", marketType: "fiat" },
  { pair: "EUR/USD", marketType: "fiat" },
  { pair: "GBP/USD", marketType: "fiat" },
  { pair: "USD/JPY", marketType: "fiat" },
  { pair: "USD/CAD", marketType: "fiat" },
  { pair: "AUD/USD", marketType: "fiat" },
  { pair: "USD/CHF", marketType: "fiat" },
  { pair: "USDT/USD", marketType: "stable" },
  { pair: "USDC/USD", marketType: "stable" },
  { pair: "DAI/USD", marketType: "stable" },
  { pair: "FDUSD/USD", marketType: "stable" },
  { pair: "TUSD/USD", marketType: "stable" },
  { pair: "PYUSD/USD", marketType: "stable" },
];

function round(value: number, decimals = 4): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function pairSeed(pair: string): number {
  return Array.from(pair).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function generateRate(pair: string, timestamp: number): number {
  const seed = pairSeed(pair);
  const minutes = timestamp / 60000;
  const baseline = ((seed % 7000) + 1200) / 1000;
  const drift = Math.sin((minutes + seed) / 9) * 0.045;
  const noise = Math.cos((minutes + seed) / 17) * 0.02;
  return round(Math.max(0.0001, baseline + drift + noise));
}

function generateDailyChange(pair: string, timestamp: number): number {
  const seed = pairSeed(pair);
  const hours = timestamp / 3600000;
  const movement = Math.sin((hours + seed) / 5) * 1.8;
  return round(movement, 2);
}

function buildQuotes(timestamp: number): FxQuote[] {
  return TRACKED_PAIRS.map(({ pair, marketType }) => ({
    pair,
    marketType,
    rate: generateRate(pair, timestamp),
    change24h: generateDailyChange(pair, timestamp),
    updatedAt: new Date(timestamp).toISOString(),
  }));
}

export async function fetchFxRates(): Promise<FxRatesResponse> {
  const latency = 400 + Math.floor(Math.random() * 500);

  await new Promise((resolve) => setTimeout(resolve, latency));

  const fetchedAt = Date.now();

  return {
    base: "USD",
    quotes: buildQuotes(fetchedAt),
    fetchedAt: new Date(fetchedAt).toISOString(),
  };
}
