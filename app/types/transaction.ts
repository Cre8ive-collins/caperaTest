export type TransactionStatus = "completed" | "pending" | "failed";

export interface TransactionItem {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amountSent: number;
  recipientGets: number;
  fee: number;
  recipientName: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface TransactionsResponse {
  transactions: TransactionItem[];
  fetchedAt: string;
}
