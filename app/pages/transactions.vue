<template>
  <section class="space-y-5">
    <div class="md:flex justify-between items-center">
      <h1 class="text-primary text-2xl font-bold leading-tight tracking-[-0.02em]">Transactions</h1>
      <QouteModal title="New Quote" />
    </div>
    <TransactionsTable title="All Transactions" :show-all="true" :show-filters="true" :page-size="10" />
  </section>
</template>

<script setup lang="ts">
import TransactionsTable from "~/components/transactions/TransactionsTable.vue";
import QouteModal from '~/components/quote/QouteModal.vue';
</script>
