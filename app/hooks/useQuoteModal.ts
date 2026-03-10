import { QUOTE_EXPIRY_SECONDS } from "~/config/quote";
import { fetchQuote } from "~/services/quoteService";
import { useCurrentTransactionStore } from "~/stores/currentTransaction";
import type { QuoteResponse } from "~/types/quote";
import { formatCurrencyValue } from "~/utils/formatters";

export const useQuoteModal = (onClose: () => void) => {
  const DEFAULT_FROM_CURRENCY = "USD";
  const DEFAULT_TO_CURRENCY = "NGN";
  const currentTransactionStore = useCurrentTransactionStore();
  const router = useRouter();

  const fromCurrency = ref(DEFAULT_FROM_CURRENCY);
  const toCurrency = ref(DEFAULT_TO_CURRENCY);
  const fromAmount = ref(0);
  const fromDraft = ref("");
  const editingFrom = ref(false);
  const quoteLoading = ref(false);
  const quoteError = ref<string | null>(null);
  const quoteResult = ref<QuoteResponse | null>(null);
  const quoteCountdown = ref(QUOTE_EXPIRY_SECONDS);
  const isRecipientModalOpen = ref(false);
  const isTransactionStatusModalOpen = ref(false);
  const transactionStatus = ref<"loading" | "success">("loading");
  const transactionStatusFromCurrency = ref("");

  const recipientName = ref("");
  const recipientAccountOrWallet = ref("");
  const recipientEmail = ref("");
  const recipientNote = ref("");

  const recipientErrors = reactive({
    name: "",
    accountOrWallet: "",
    email: "",
  });

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

  const clearRecipientErrors = () => {
    recipientErrors.name = "";
    recipientErrors.accountOrWallet = "";
    recipientErrors.email = "";
  };

  const clearRecipientForm = () => {
    recipientName.value = "";
    recipientAccountOrWallet.value = "";
    recipientEmail.value = "";
    recipientNote.value = "";
    clearRecipientErrors();
  };

  const clearQuoteForm = () => {
    fromCurrency.value = DEFAULT_FROM_CURRENCY;
    toCurrency.value = DEFAULT_TO_CURRENCY;
    fromAmount.value = 0;
    fromDraft.value = "";
    editingFrom.value = false;
  };

  const resetForModalClose = () => {
    clearQuoteForm();
    clearQuoteResult();
    quoteError.value = null;
    isRecipientModalOpen.value = false;
    isTransactionStatusModalOpen.value = false;
    transactionStatus.value = "loading";
    transactionStatusFromCurrency.value = "";
    clearRecipientForm();
    currentTransactionStore.clearCurrentTransaction();
  };

  const simulateTransactionApi = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
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

  const fromAmountInput = computed(() =>
    editingFrom.value ? fromDraft.value : formatCurrencyValue(fromAmount.value)
  );

  const handleAmountFocus = () => {
    editingFrom.value = true;
    fromDraft.value = fromAmount.value ? String(fromAmount.value) : "";
  };

  const handleAmountInput = (value: string) => {
    const sanitized = sanitizeMoneyInput(value);
    fromDraft.value = sanitized;
    fromAmount.value = parseMoneyInput(sanitized);
  };

  const handleAmountBlur = () => {
    editingFrom.value = false;
    fromDraft.value = formatCurrencyValue(fromAmount.value);
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
    } catch (error) {
      quoteError.value =
        error instanceof Error ? error.message : "Unable to get quote right now.";
    } finally {
      quoteLoading.value = false;
    }
  };

  const handleProceedToRecipient = () => {
    if (!quoteResult.value) {
      return;
    }

    currentTransactionStore.setCurrentTransaction({
      fromCurrency: fromCurrency.value,
      toCurrency: toCurrency.value,
      quote: quoteResult.value,
    });

    stopCountdown();
    isRecipientModalOpen.value = true;
  };

  const validateRecipientForm = (): boolean => {
    clearRecipientErrors();

    if (!recipientName.value.trim()) {
      recipientErrors.name = "Recipient name is required.";
    }

    if (!recipientAccountOrWallet.value.trim()) {
      recipientErrors.accountOrWallet = "Account/Wallet is required.";
    }

    const emailValue = recipientEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
      recipientErrors.email = "Recipient email is required.";
    } else if (!emailRegex.test(emailValue)) {
      recipientErrors.email = "Enter a valid email address.";
    }

    return !recipientErrors.name && !recipientErrors.accountOrWallet && !recipientErrors.email;
  };

  const handleBackToQuote = () => {
    isRecipientModalOpen.value = false;
    clearQuoteResult();
  };

  const handleConfirmAndSend = async () => {
    if (!validateRecipientForm()) {
      return;
    }

    transactionStatusFromCurrency.value = fromCurrency.value;

    console.log("Transaction payload", {
      transaction: currentTransactionStore.currentTransaction,
      recipient: {
        name: recipientName.value.trim(),
        accountOrWallet: recipientAccountOrWallet.value.trim(),
        email: recipientEmail.value.trim(),
        note: recipientNote.value.trim() || null,
      },
    });

    clearQuoteForm();
    clearQuoteResult();
    clearRecipientForm();
    currentTransactionStore.clearCurrentTransaction();
    quoteError.value = null;
    isRecipientModalOpen.value = false;
    isTransactionStatusModalOpen.value = true;
    transactionStatus.value = "loading";

    await simulateTransactionApi();
    transactionStatus.value = "success";
  };

  const handleRecipientModalClose = () => {
    resetForModalClose();
    onClose();
  };

  const handleTransactionStatusClose = () => {
    resetForModalClose();
    onClose();
  };

  const handleSendMore = () => {
    isTransactionStatusModalOpen.value = false;
    transactionStatus.value = "loading";
    transactionStatusFromCurrency.value = "";
  };

  const handleViewTransactions = async () => {
    resetForModalClose();
    onClose();
    await router.push("/transactions");
  };

  onBeforeUnmount(() => {
    stopCountdown();
  });

  return {
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
  };
};
