<template>
    <AppModal :open="open && !isRecipientModalOpen && !isTransactionStatusModalOpen" :title="title" @close="emit('close')">
        <div class=" flex flex-col gap-3 justify-center items-center">
            <p class="text-center text-gray-500 dark:text-gray-400">Enter amount </p>
            <input type="text" :value="fromAmountInput" inputmode="decimal"
                class="w-full text-4xl font-semibold bg-transparent focus:outline-none text-center" placeholder="0.00"
                @focus="handleAmountFocus"
                @input="handleAmountInput(($event.target as HTMLInputElement).value)"
                @blur="handleAmountBlur" autofocus="true" />

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
                @proceed="handleProceedToRecipient"
            />
        </div>
    </AppModal>

    <RecipientDetailsModal
        :open="open && isRecipientModalOpen && !isTransactionStatusModalOpen"
        :recipient-name="recipientName"
        :recipient-account-or-wallet="recipientAccountOrWallet"
        :recipient-email="recipientEmail"
        :recipient-note="recipientNote"
        :recipient-errors="recipientErrors"
        @close="handleRecipientModalClose"
        @back="handleBackToQuote"
        @confirm="handleConfirmAndSend"
        @update:recipient-name="recipientName = $event"
        @update:recipient-account-or-wallet="recipientAccountOrWallet = $event"
        @update:recipient-email="recipientEmail = $event"
        @update:recipient-note="recipientNote = $event"
    />

    <TransactionStatusModal
        :open="open && isTransactionStatusModalOpen"
        :status="transactionStatus"
        :from-currency="transactionStatusFromCurrency"
        @close="handleTransactionStatusClose"
        @send-more="handleSendMore"
        @view-transactions="handleViewTransactions"
    />
</template>

<script setup lang="ts">
import AppModal from "~/components/shared/AppModal.vue";
import CurrencyPicker from "../shared/CurrencyPicker.vue";
import QuoteDetails from "./QuoteDetails.vue";
import RecipientDetailsModal from "./RecipientDetailsModal.vue";
import TransactionStatusModal from "./TransactionStatusModal.vue";
import { useQuoteModal } from "~/hooks/useQuoteModal";

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
const {
    fromCurrency,
    toCurrency,
    fromAmount,
    quoteLoading,
    quoteError,
    quoteResult,
    quoteCountdownLabel,
    isRecipientModalOpen,
    isTransactionStatusModalOpen,
    transactionStatus,
    transactionStatusFromCurrency,
    recipientName,
    recipientAccountOrWallet,
    recipientEmail,
    recipientNote,
    recipientErrors,
    fromAmountInput,
    handleAmountFocus,
    handleAmountInput,
    handleAmountBlur,
    switchCurrencies,
    handleGetQuote,
    handleProceedToRecipient,
    handleBackToQuote,
    handleConfirmAndSend,
    handleRecipientModalClose,
    handleTransactionStatusClose,
    handleSendMore,
    handleViewTransactions,
    resetForModalClose,
} = useQuoteModal(() => emit("close"));

watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) {
            resetForModalClose();
        }
    }
);

</script>