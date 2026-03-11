<template>
  <div class=" flex flex-col gap-10">
    <section class="space-y-5">
      <div class=" md:flex justify-between">
        <h1 class="text-primary text-2xl font-bold leading-tight tracking-[-0.02em]">Market Overview</h1>
        <QouteModal title="New Quote" />
      </div>
      <FxRateTracker />

    </section>
    <section class="space-y-5">
      <div class=" flex justify-between">
        <h1 class="text-primary text-2xl font-bold leading-tight tracking-[-0.02em]">Recent Activity</h1>
      </div>
      <TransactionsTable />
    </section>
  </div>
</template>

<script setup lang="ts">
import QouteModal from '~/components/quote/QouteModal.vue';
import TransactionsTable from '~/components/transactions/TransactionsTable.vue';
</script>