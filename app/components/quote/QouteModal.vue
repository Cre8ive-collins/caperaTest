<template>
    <AppModal :open="open" :title="title" @close="emit('close')">
        <div class=" flex flex-col gap-3 justify-center items-center">
            <p class="text-center text-gray-500 dark:text-gray-400">Enter amount </p>
            <input type="text" :value="fromAmountInput" inputmode="decimal"
                class="w-full text-4xl font-semibold bg-transparent focus:outline-none text-center" placeholder="0.00"
                @focus="handleAmountFocus('from')"
                @input="handleAmountInput('from', ($event.target as HTMLInputElement).value)"
                @blur="handleAmountBlur('from')" autofocus="true" />

            <CurrencyPicker id="from-currency" v-model="fromCurrency" class="" />
            <Icon name="lucide:arrow-left-right"
                class="w-10 h-10 rotate-90  text-primary dark:text-gray-400 cursor-pointer" @click="switchCurrencies" />
            <CurrencyPicker id="to-currency" v-model="toCurrency" class="" />
            <button type="button" :disabled="!fromAmount || quoteLoading"
                class="mt-5 inline-flex items-center justify-center rounded-md p-3 w-full border border-primary/40 text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                @click="handleGetQuote">
                <template v-if="quoteLoading">
                    <div class="flex items-center">
                        <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                        <span class="ml-2">Getting quote...</span>
                    </div>
                </template>
                <template v-else>
                    Get Quote
                </template>
            </button>

            <p v-if="quoteError"
                class="w-full rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                {{ quoteError }}
            </p>

            <QuoteDetails
                v-if="quoteResult"
                :quote-result="quoteResult"
                :from-currency="fromCurrency"
                :to-currency="toCurrency"
                :quote-countdown-label="quoteCountdownLabel"
                :proceed-disabled="!fromAmount || quoteLoading"
            />
        </div>
    </AppModal>
</template>

<script setup lang="ts">
import AppModal from "~/components/shared/AppModal.vue";
import CurrencyPicker from "../shared/CurrencyPicker.vue";
import QuoteDetails from "./QuoteDetails.vue";
import { QUOTE_EXPIRY_SECONDS } from "~/config/quote";
import { fetchQuote } from "~/services/quoteService";
import type { QuoteResponse } from "~/types/quote";
import { formatCurrencyValue } from "~/utils/formatters";

const props = withDefaults(
    defineProps<{
        open: boolean;
        title?: string;
    }>(),
    {
        title: "Modal",
    }
);

const emit = defineEmits<{
    close: [];
}>();

const fromCurrency = ref("USD");
const toCurrency = ref("NGN");
const fromAmount = ref(0);
const toAmount = ref(0);
const fromDraft = ref("");
const toDraft = ref("");
const editingFrom = ref(false);
const editingTo = ref(false);
const quoteLoading = ref(false);
const quoteError = ref<string | null>(null);
const quoteResult = ref<QuoteResponse | null>(null);
const quoteCountdown = ref(QUOTE_EXPIRY_SECONDS);

let countdownIntervalId: ReturnType<typeof setInterval> | null = null;

const stopCountdown = () => {
    if (!countdownIntervalId) {
        return;
    }

    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
};

const clearQuoteResult = () => {
    quoteResult.value = null;
    quoteCountdown.value = QUOTE_EXPIRY_SECONDS;
    stopCountdown();
};

const startCountdown = () => {
    stopCountdown();
    quoteCountdown.value = QUOTE_EXPIRY_SECONDS;

    countdownIntervalId = setInterval(() => {
        if (quoteCountdown.value <= 1) {
            clearQuoteResult();
            return;
        }

        quoteCountdown.value -= 1;
    }, 1000);
};

const quoteCountdownLabel = computed(() => {
    const minutes = Math.floor(quoteCountdown.value / 60);
    const seconds = quoteCountdown.value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const parseMoneyInput = (value: string): number => {
    const normalized = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    const parsed = Number(normalized);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return parsed;
};

const sanitizeMoneyInput = (value: string): string => {
    const cleaned = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    const [whole = "", ...rest] = cleaned.split(".");
    const decimals = rest.join("").slice(0, 2);

    return rest.length > 0 ? `${whole}.${decimals}` : whole;
};

const fromAmountInput = computed({
    get: () => (editingFrom.value ? fromDraft.value : formatCurrencyValue(fromAmount.value)),
    set: () => { },
});

const toAmountInput = computed({
    get: () => (editingTo.value ? toDraft.value : formatCurrencyValue(toAmount.value)),
    set: () => { },
});

const handleAmountFocus = (field: "from" | "to") => {
    if (field === "from") {
        editingFrom.value = true;
        fromDraft.value = fromAmount.value ? String(fromAmount.value) : "";
        return;
    }

    editingTo.value = true;
    toDraft.value = toAmount.value ? String(toAmount.value) : "";
};

const handleAmountInput = (field: "from" | "to", value: string) => {
    const sanitized = sanitizeMoneyInput(value);

    if (field === "from") {
        fromDraft.value = sanitized;
        fromAmount.value = parseMoneyInput(sanitized);
        return;
    }

    toDraft.value = sanitized;
    toAmount.value = parseMoneyInput(sanitized);
};

const handleAmountBlur = (field: "from" | "to") => {
    if (field === "from") {
        editingFrom.value = false;
        fromDraft.value = formatCurrencyValue(fromAmount.value);
        return;
    }

    editingTo.value = false;
    toDraft.value = formatCurrencyValue(toAmount.value);
};

const switchCurrencies = () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
};

const handleGetQuote = async () => {
    if (!fromAmount.value) {
        return;
    }

    quoteLoading.value = true;
    quoteError.value = null;

    try {
        const response = await fetchQuote({
            amount: fromAmount.value,
            fromCurrency: fromCurrency.value,
            toCurrency: toCurrency.value,
        });

        quoteResult.value = response;
        startCountdown();
        toAmount.value = response.recipientGets;
        toDraft.value = formatCurrencyValue(response.recipientGets);
    } catch (error) {
        quoteError.value = error instanceof Error ? error.message : "Unable to get quote right now.";
    } finally {
        quoteLoading.value = false;
    }
};

watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) {
            clearQuoteResult();
            quoteError.value = null;
        }
    }
);

onBeforeUnmount(() => {
    stopCountdown();
});


</script>