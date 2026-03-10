

<template>
    <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-lg font-bold tracking-[-0.02em] text-black dark:text-white">Live FX Rate Tracker</h2>
                <p v-if="data" class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {{ new Date(data.fetchedAt).toLocaleTimeString() }}
                </p>
            </div>

            <div class="flex items-center gap-2">
                <NuxtLink
                    v-if="!showAll"
                    to="/rates"
                    class="inline-flex items-center rounded-full border border-primary/40 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                    View all rates
                </NuxtLink>

                <button type="button"
                    aria-label="Refresh rates"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary/10"
                    @click="refresh">
                    <Icon name="lucide:refresh-cw" class="h-4 w-4" />
                </button>
            </div>
        </div>

        <div v-if="loading" class="mt-6 overflow-hidden">
            <table class="min-w-full animate-pulse">
                <thead class="bg-transparent">
                    <tr>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                            Pair</th>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                            Rate</th>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                            Market</th>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 dark:text-gray-500">
                            24h</th>
                    </tr>
                </thead>
                <tbody class="bg-transparent">
                    <tr
                        v-for="row in skeletonRows"
                        :key="`skeleton-${row}`"
                        class="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
                    >
                        <td class="px-4 py-3">
                            <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                        </td>
                        <td class="px-4 py-3">
                            <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                        </td>
                        <td class="px-4 py-3">
                            <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                        </td>
                        <td class="px-4 py-3">
                            <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="error"
            class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            <p>{{ error }}</p>
            <button type="button"
                class="mt-3 inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white"
                @click="refresh">
                Retry
            </button>
        </div>

        <div v-else class="mt-6 overflow-hidden">
            <table class="min-w-full">
                <thead class="bg-transparent">
                    <tr>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">
                            Pair</th>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">
                            Rate</th>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">
                            Market</th>
                        <th
                            class="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-300">
                            24h</th>
                    </tr>
                </thead>
                <tbody class="bg-transparent">
                    <tr v-for="quote in paginatedQuotes" :key="quote.pair" class="border-b border-gray-200 last:border-b-0 dark:border-gray-800">
                        <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{{ quote.pair }}</td>
                        <td class="px-4 py-3 text-sm font-medium"
                            :class="{
                              'text-primary': rateDirectionByPair[quote.pair] === 'up',
                              'text-red-500 dark:text-red-400': rateDirectionByPair[quote.pair] === 'down',
                              'text-gray-700 dark:text-gray-200': rateDirectionByPair[quote.pair] === 'flat'
                            }">
                            <span class="inline-flex items-center gap-1">
                                <Icon
                                    v-if="rateDirectionByPair[quote.pair] === 'up'"
                                    name="lucide:arrow-up-right"
                                    class="h-4 w-4" />
                                <Icon
                                    v-else-if="rateDirectionByPair[quote.pair] === 'down'"
                                    name="lucide:arrow-down-right"
                                    class="h-4 w-4" />
                                <Icon
                                    v-else
                                    name="lucide:minus"
                                    class="h-4 w-4 text-gray-400" />
                                {{ formatRate(quote.rate) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <span
                                class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
                                :class="quote.marketType === 'fiat'
                                  ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                                  : 'bg-primary/10 text-primary'"
                            >
                                {{ quote.marketType === "fiat" ? "Fiat" : "Stable" }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm font-medium"
                            :class="quote.change24h >= 0 ? 'text-primary' : 'text-red-500 dark:text-red-400'">
                            <span class="inline-flex items-center gap-1">
                                <Icon
                                    :name="quote.change24h >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                                    class="h-4 w-4" />
                                {{ formatChangePercent(quote.change24h) }}
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
import { useFxRates } from "~/hooks/useFxRates";
import { formatChangePercent, formatRate } from "~/utils/formatters";

const props = withDefaults(
    defineProps<{
        showAll?: boolean;
        pageSize?: number;
    }>(),
    {
        showAll: false,
        pageSize: 8,
    }
);

const currentPage = ref(1);

const { data, loading, error, refresh, rateDirectionByPair } = useFxRates();

const summaryQuotes = computed(() => {
    const quotes = data.value?.quotes ?? [];
    const fiat = quotes.filter((quote) => quote.marketType === "fiat").slice(0, 3);
    const stable = quotes.filter((quote) => quote.marketType === "stable").slice(0, 3);
    return [...fiat, ...stable];
});

const sourceQuotes = computed(() => (props.showAll ? (data.value?.quotes ?? []) : summaryQuotes.value));

const totalPages = computed(() => {
    if (!props.showAll) {
        return 1;
    }

    return Math.max(1, Math.ceil(sourceQuotes.value.length / props.pageSize));
});

const paginatedQuotes = computed(() => {
    if (!props.showAll) {
        return sourceQuotes.value;
    }

    const start = (currentPage.value - 1) * props.pageSize;
    const end = start + props.pageSize;
    return sourceQuotes.value.slice(start, end);
});

const skeletonRows = computed(() => (props.showAll ? Math.min(props.pageSize, 10) : 6));

watch(sourceQuotes, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
    }
});

const nextPage = () => {
    currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
};

const previousPage = () => {
    currentPage.value = Math.max(1, currentPage.value - 1);
};
</script>