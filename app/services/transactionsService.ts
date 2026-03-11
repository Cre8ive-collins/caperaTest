import type { TransactionItem, TransactionStatus, TransactionsResponse } from "~/types/transaction";

const FROM_CURRENCIES = ["USD", "EUR", "GBP", "USDT", "USDC", "DAI"];
const TO_CURRENCIES = ["NGN", "KES", "GHS", "USD", "EUR", "GBP"];
const RECIPIENTS = [
  "Amina Ojo",
  "David Chen",
  "Liam Martins",
  "Sara Bello",
  "Maya Patel",
  "Noah Green",
  "Yara Ibrahim",
  "Zain Ade",
];

const BASE_TIMESTAMP = Date.now();

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getStatus(index: number): TransactionStatus {
  if (index % 11 === 0) {
    return "failed";
  }

  if (index % 5 === 0) {
    return "pending";
  }

  return "completed";
}

function buildTransaction(index: number): TransactionItem {
  const fromCurrency = FROM_CURRENCIES[index % FROM_CURRENCIES.length] ?? "USD";
  const toCurrency = TO_CURRENCIES[(index + 2) % TO_CURRENCIES.length] ?? "NGN";
  const baseAmount = 100 + ((index * 37) % 1800);
  const amountSent = round(baseAmount + (index % 7) * 0.75);
  const fee = round(Math.max(0.5, amountSent * 0.012));
  const fxRate = 1 + ((index * 13) % 70) / 100;
  const recipientGets = round((amountSent - fee) * fxRate);
  const createdAt = new Date(BASE_TIMESTAMP - index * 3_600_000).toISOString();

  return {
    id: `txn_${String(index + 1).padStart(5, "0")}`,
    fromCurrency,
    toCurrency,
    amountSent,
    recipientGets,
    fee,
    recipientName: RECIPIENTS[index % RECIPIENTS.length] ?? "Unknown Recipient",
    status: getStatus(index),
    createdAt,
  };
}

function buildTransactions(total = 48): TransactionItem[] {
  return Array.from({ length: total }, (_, index) => buildTransaction(index)).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function fetchTransactions(): Promise<TransactionsResponse> {
  const latency = 350 + Math.floor(Math.random() * 500);
  await new Promise((resolve) => setTimeout(resolve, latency));

  const fetchedAt = new Date().toISOString();

  return {
    transactions: buildTransactions(),
    fetchedAt,
  };
}
