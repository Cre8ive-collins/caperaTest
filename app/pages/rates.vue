<template>
    <section class="space-y-5">
        <div class="md:flex justify-between items-center">
            <h1 class="text-primary text-2xl font-bold leading-tight tracking-[-0.02em]">Rates</h1>
            <QouteModal title="New Quote" />
        </div>
        <FxRateTracker :show-all="true" :page-size="10" />
    </section>
</template>

<script setup lang="ts">
import QouteModal from '~/components/quote/QouteModal.vue';
import FxRateTracker from '~/components/fx/FxRateTracker.vue';
</script>