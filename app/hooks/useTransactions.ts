import { fetchTransactions } from "~/services/transactionsService";
import type { TransactionsResponse } from "~/types/transaction";

export function useTransactions() {
  const data = ref<TransactionsResponse | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const loadTransactions = async () => {
    try {
      error.value = null;
      data.value = await fetchTransactions();
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Unexpected error while loading transactions.";
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadTransactions);

  return {
    data,
    loading,
    error,
    refresh: loadTransactions,
  };
}
