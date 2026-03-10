import type { QuoteRequest, QuoteResponse } from "~/types/quote";

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function pairSeed(fromCurrency: string, toCurrency: string): number {
  return `${fromCurrency}-${toCurrency}`
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function generateExchangeRate(fromCurrency: string, toCurrency: string, timestamp: number): number {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const seed = pairSeed(fromCurrency, toCurrency);
  const minutes = timestamp / 60000;
  const baseline = ((seed % 6500) + 900) / 1000;
  const drift = Math.sin((minutes + seed) / 13) * 0.04;
  const noise = Math.cos((minutes + seed) / 29) * 0.015;

  return round(Math.max(0.0001, baseline + drift + noise), 4);
}

function calculateTransferFee(amount: number): number {
  const variableFee = amount * 0.0035;
  const fixedFee = 1.25;
  return round(Math.max(fixedFee, variableFee), 2);
}

export async function fetchQuote(request: QuoteRequest): Promise<QuoteResponse> {
  const latency = 250 + Math.floor(Math.random() * 350);
  await new Promise((resolve) => setTimeout(resolve, latency));

  const quotedAtMs = Date.now();
  const exchangeRate = generateExchangeRate(request.fromCurrency, request.toCurrency, quotedAtMs);
  const amountSent = round(request.amount, 2);
  const transferFee = calculateTransferFee(amountSent);
  const recipientGets = round(Math.max(0, amountSent) * exchangeRate, 2);

  return {
    exchangeRate,
    transferFee,
    amountSent,
    recipientGets,
    quotedAt: new Date(quotedAtMs).toISOString(),
  };
}
