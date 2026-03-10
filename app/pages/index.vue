<template>
  <section class="space-y-5">
    <div class=" flex justify-between">
      <h1 class="text-primary text-2xl font-bold leading-tight tracking-[-0.02em]">Market Overview</h1>
      <button type="button" aria-label="Refresh rates"
        class="inline-flex items-center justify-center rounded-md px-8 border border-primary/40 text-primary transition-colors hover:bg-primary/10">
        New Quote
      </button>
    </div>
    <FxRateTracker />
  </section>
</template>
