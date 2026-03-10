import type { QuoteResponse } from "~/types/quote";

export interface CurrentTransaction {
  fromCurrency: string;
  toCurrency: string;
  quote: QuoteResponse;
}

export const useCurrentTransactionStore = defineStore("currentTransaction", () => {
  const currentTransaction = ref<CurrentTransaction | null>(null);

  const setCurrentTransaction = (transaction: CurrentTransaction) => {
    currentTransaction.value = transaction;
  };

  const clearCurrentTransaction = () => {
    currentTransaction.value = null;
  };

  return {
    currentTransaction,
    setCurrentTransaction,
    clearCurrentTransaction,
  };
});
