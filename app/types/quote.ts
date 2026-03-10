export interface QuoteRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface QuoteResponse {
  exchangeRate: number;
  transferFee: number;
  amountSent: number;
  recipientGets: number;
  quotedAt: string;
}
