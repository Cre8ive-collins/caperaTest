<template>
  <div class="mt-2 w-full rounded-lg border border-gray-200 p-3 dark:border-gray-800">
    <div class="grid grid-cols-2 gap-2 text-sm">
      <p class="text-gray-500 dark:text-gray-400">Exchange rate</p>
      <p class="text-right font-medium text-gray-900 dark:text-gray-100">
        1 {{ fromCurrency }} = {{ formatRate(quoteResult.exchangeRate) }} {{ toCurrency }}
      </p>

      <p class="text-gray-500 dark:text-gray-400">Transfer fee</p>
      <p class="text-right font-medium text-gray-900 dark:text-gray-100">
        {{ fromCurrency }} {{ formatCurrencyValue(quoteResult.transferFee) }}
      </p>

      <p class="text-gray-500 dark:text-gray-400">Amount sent</p>
      <p class="text-right font-medium text-gray-900 dark:text-gray-100">
        {{ fromCurrency }} {{ formatCurrencyValue(quoteResult.amountSent) }}
      </p>

      <p class="text-gray-500 dark:text-gray-400">Recipient gets</p>
      <p class="text-right font-semibold text-primary">
        {{ toCurrency }} {{ formatCurrencyValue(quoteResult.recipientGets) }}
      </p>
    </div>

    <button
      type="button"
      :disabled="proceedDisabled"
      class="mt-5 inline-flex items-center justify-center rounded-md p-3 w-full border border-primary/40 text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
      @click="emit('proceed')"
    >
      Proceed to Send ({{ quoteCountdownLabel }})
      <Icon name="lucide:arrow-right" class="ml-2 h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { QuoteResponse } from "~/types/quote";
import { formatCurrencyValue, formatRate } from "~/utils/formatters";

defineProps<{
  quoteResult: QuoteResponse;
  fromCurrency: string;
  toCurrency: string;
  quoteCountdownLabel: string;
  proceedDisabled: boolean;
}>();

const emit = defineEmits<{
  proceed: [];
}>();
</script>
