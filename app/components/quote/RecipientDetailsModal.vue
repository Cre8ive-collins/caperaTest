<template>
  <AppModal :open="open" title="Recipient Details" @close="emit('close')">
    <form class="space-y-3" @submit.prevent="emit('confirm')">
      <AppInput
        id="recipient-name"
        :model-value="recipientName"
        label="Name"
        placeholder="Enter recipient name"
        :error="recipientErrors.name"
        @update:model-value="emit('update:recipientName', $event)"
      />

      <AppInput
        id="recipient-account"
        :model-value="recipientAccountOrWallet"
        label="Account/Wallet"
        placeholder="Enter account number or wallet address"
        :error="recipientErrors.accountOrWallet"
        @update:model-value="emit('update:recipientAccountOrWallet', $event)"
      />

      <AppInput
        id="recipient-email"
        :model-value="recipientEmail"
        label="Email"
        type="email"
        placeholder="Enter recipient email"
        :error="recipientErrors.email"
        @update:model-value="emit('update:recipientEmail', $event)"
      />

      <AppInput
        id="recipient-note"
        :model-value="recipientNote"
        label="Note (OPTIONAL)"
        placeholder="Add note"
        @update:model-value="emit('update:recipientNote', $event)"
      />

      <div class="pt-2 flex gap-2">
        <button
          type="button"
          class="inline-flex flex-1 items-center justify-center rounded-md p-3 border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="emit('back')"
        >
          Back
        </button>
        <button
          type="submit"
          class="inline-flex flex-1 items-center justify-center rounded-md p-3 border border-primary/40 text-primary transition-colors hover:bg-primary/10"
        >
          Confirm &amp; Send
        </button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import AppInput from "~/components/shared/AppInput.vue";
import AppModal from "~/components/shared/AppModal.vue";

defineProps<{
  open: boolean;
  recipientName: string;
  recipientAccountOrWallet: string;
  recipientEmail: string;
  recipientNote: string;
  recipientErrors: {
    name: string;
    accountOrWallet: string;
    email: string;
  };
}>();

const emit = defineEmits<{
  close: [];
  back: [];
  confirm: [];
  "update:recipientName": [value: string];
  "update:recipientAccountOrWallet": [value: string];
  "update:recipientEmail": [value: string];
  "update:recipientNote": [value: string];
}>();
</script>
