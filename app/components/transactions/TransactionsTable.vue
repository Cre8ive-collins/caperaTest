<template>
  <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold tracking-[-0.02em] text-black dark:text-white">{{ title }}</h2>
        <p v-if="data" class="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Last updated: {{ new Date(data.fetchedAt).toLocaleTimeString() }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          v-if="!showAll"
          to="/transactions"
          class="inline-flex items-center rounded-full border border-primary/40 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
        >
          View more
        </NuxtLink>

        <button
          type="button"
          aria-label="Refresh transactions"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary/10"
          @click="refresh"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div v-if="showFilters" class="mt-4 grid gap-3 md:grid-cols-2">
      <label class="space-y-1">
        <span class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</span>
        <select
          v-model="selectedStatus"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </label>

      <label class="space-y-1">
        <span class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Currency</span>
        <select
          v-model="selectedCurrency"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="all">All</option>
          <option v-for="currency in availableCurrencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="loading" class="mt-6 overflow-hidden">
      <table class="min-w-full animate-pulse">
        <thead>
          <tr>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">ID</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">Pair</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">Recipient</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">Sent</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in skeletonRows"
            :key="`txn-skeleton-${row}`"
            class="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
          >
            <td class="px-4 py-3"><div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" /></td>
            <td class="px-4 py-3"><div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" /></td>
            <td class="px-4 py-3"><div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" /></td>
            <td class="px-4 py-3"><div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" /></td>
            <td class="px-4 py-3"><div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else-if="error"
      class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
    >
      <p>{{ error }}</p>
      <button
        type="button"
        class="mt-3 inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white"
        @click="refresh"
      >
        Retry
      </button>
    </div>

    <div v-else class="mt-6 overflow-hidden">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">ID</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">Pair</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">Recipient</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">Sent</th>
            <th class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            class="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
          >
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{{ transaction.id }}</td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ transaction.fromCurrency }}/{{ transaction.toCurrency }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{{ transaction.recipientName }}</td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ formatAmount(transaction.amountSent, transaction.fromCurrency) }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span class="inline-flex rounded-full px-2 py-1 text-xs font-medium" :class="statusClass(transaction.status)">
                {{ transaction.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAll && totalPages > 1" class="mt-4 flex items-center justify-end gap-2">
      <button
        type="button"
        class="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        :disabled="currentPage === 1"
        @click="previousPage"
      >
        Prev
      </button>
      <span class="text-xs text-gray-500 dark:text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        type="button"
        class="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTransactions } from "~/hooks/useTransactions";
import { formatCurrencyValue } from "~/utils/formatters";
import type { TransactionItem, TransactionStatus } from "~/types/transaction";

const props = withDefaults(
  defineProps<{
    title?: string;
    showAll?: boolean;
    pageSize?: number;
    showFilters?: boolean;
  }>(),
  {
    title: "Recent Transactions",
    showAll: false,
    pageSize: 8,
    showFilters: false,
  }
);

const currentPage = ref(1);
const selectedStatus = ref<"all" | TransactionStatus>("all");
const selectedCurrency = ref("all");
const { data, loading, error, refresh } = useTransactions();

const sourceTransactions = computed((): TransactionItem[] => {
  const transactions = data.value?.transactions ?? [];
  return props.showAll ? transactions : transactions.slice(0, 8);
});

const availableCurrencies = computed(() => {
  const currencies = new Set<string>();

  (data.value?.transactions ?? []).forEach((transaction) => {
    currencies.add(transaction.fromCurrency);
    currencies.add(transaction.toCurrency);
  });

  return Array.from(currencies).sort();
});

const filteredTransactions = computed(() => {
  return sourceTransactions.value.filter((transaction) => {
    const statusMatch =
      selectedStatus.value === "all" || transaction.status === selectedStatus.value;
    const currencyMatch =
      selectedCurrency.value === "all" ||
      transaction.fromCurrency === selectedCurrency.value ||
      transaction.toCurrency === selectedCurrency.value;

    return statusMatch && currencyMatch;
  });
});

const totalPages = computed(() => {
  if (!props.showAll) {
    return 1;
  }

  return Math.max(1, Math.ceil(filteredTransactions.value.length / props.pageSize));
});

const paginatedTransactions = computed(() => {
  if (!props.showAll) {
    return filteredTransactions.value;
  }

  const start = (currentPage.value - 1) * props.pageSize;
  const end = start + props.pageSize;
  return filteredTransactions.value.slice(start, end);
});

const skeletonRows = computed(() => (props.showAll ? Math.min(props.pageSize, 10) : 8));

watch([filteredTransactions, selectedStatus, selectedCurrency], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }

  if (currentPage.value < 1) {
    currentPage.value = 1;
  }
});

const nextPage = () => {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
};

const previousPage = () => {
  currentPage.value = Math.max(1, currentPage.value - 1);
};

const formatAmount = (value: number, currency: string) => `${currency} ${formatCurrencyValue(value)}`;

const statusClass = (status: TransactionStatus) => {
  if (status === "completed") {
    return "bg-primary/10 text-primary";
  }

  if (status === "pending") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  }

  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
};
</script>
