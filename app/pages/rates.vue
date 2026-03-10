<template>
  <section class="space-y-5">
    <div>
      <h1 class="text-primary text-4xl font-bold leading-tight tracking-[-0.02em]">All Rates</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Browse the full list of tracked fiat and stablecoin pairs.
      </p>
    </div>

    <FxRateTracker :show-all="true" :page-size="10" />
  </section>
</template>
