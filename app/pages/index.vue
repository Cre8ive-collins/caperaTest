

<template>
  <section class="space-y-5">
    <div class=" flex justify-between">
      <h1 class="text-primary text-2xl font-bold leading-tight tracking-[-0.02em]">Market Overview</h1>
      <button type="button" aria-label="Refresh rates" @click="openQuoteModal = true"
        class="inline-flex items-center justify-center rounded-md px-8 border border-primary/40 text-primary transition-colors hover:bg-primary/10">
        New Quote
      </button>
    </div>
    <FxRateTracker />
    <QouteModal :open="openQuoteModal" title="New Quote" @close="openQuoteModal = false">
      <p>This is a quote modal. You can place your quote form here.</p>
    </QouteModal>
  </section>
</template>

<script setup lang="ts">
import QouteModal from '~/components/quote/QouteModal.vue';
const openQuoteModal = ref(false);
</script>