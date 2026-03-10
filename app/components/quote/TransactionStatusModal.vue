<template>
  <AppModal :open="open" :title="statusTitle" @close="emit('close')">
    <div class="flex flex-col items-center gap-4 py-2 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full"
        :class="
          status === 'loading'
            ? 'bg-primary/10 text-primary'
            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
        "
      >
        <Icon
          v-if="status === 'loading'"
          name="lucide:loader-2"
          class="h-8 w-8 animate-spin"
        />
        <Icon
          v-else
          name="lucide:circle-check-big"
          class="h-8 w-8 animate-bounce"
        />
      </div>

      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ statusTitle }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">{{ statusSubtitle }}</p>

      <div v-if="status === 'success'" class="mt-2 flex w-full gap-2">
        <button
          type="button"
          class="inline-flex flex-1 items-center justify-center rounded-md border border-primary/40 p-3 text-primary transition-colors hover:bg-primary/10"
          @click="emit('sendMore')"
        >
          Send Again
        </button>
        <button
          type="button"
          class="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 p-3 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="emit('viewTransactions')"
        >
          Transactions
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from "~/components/shared/AppModal.vue";

const props = defineProps<{
  open: boolean;
  status: "loading" | "success";
  fromCurrency: string;
}>();

const emit = defineEmits<{
  close: [];
  sendMore: [];
  viewTransactions: [];
}>();

const statusTitle = computed(() =>
  props.status === "loading" ? "Processing Transaction" : "Transaction Successful"
);

const statusSubtitle = computed(() =>
  props.status === "loading"
    ? "we're verifying your transaction please wait"
    : `your ${props.fromCurrency} has been sent to the recipinet`
);
</script>
