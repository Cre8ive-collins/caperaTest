import type { FxRatesResponse } from "~/types/fx";
import { fetchFxRates } from "~/services/fxRatesService";

const REFRESH_INTERVAL_MS = 30_000;

export function useFxRates() {
  const data = ref<FxRatesResponse | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const previousRates = ref<Record<string, number>>({});
  const rateDirectionByPair = ref<Record<string, "up" | "down" | "flat">>({});

  let intervalId: ReturnType<typeof setInterval> | null = null;

  const loadRates = async () => {
    try {
      error.value = null;
      const response = await fetchFxRates();

      const nextDirections: Record<string, "up" | "down" | "flat"> = {};
      response.quotes.forEach((quote) => {
        const previousRate = previousRates.value[quote.pair];
        if (previousRate === undefined) {
          nextDirections[quote.pair] = "flat";
        } else if (quote.rate > previousRate) {
          nextDirections[quote.pair] = "up";
        } else if (quote.rate < previousRate) {
          nextDirections[quote.pair] = "down";
        } else {
          nextDirections[quote.pair] = "flat";
        }
      });

      previousRates.value = Object.fromEntries(response.quotes.map((quote) => [quote.pair, quote.rate]));
      rateDirectionByPair.value = nextDirections;
      data.value = response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unexpected error while loading FX rates.";
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await loadRates();
    intervalId = setInterval(loadRates, REFRESH_INTERVAL_MS);
  });

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return {
    data,
    loading,
    error,
    rateDirectionByPair,
    refresh: loadRates,
  };
}
