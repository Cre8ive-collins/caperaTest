<script setup lang="ts">
const counter = useCounterStore();
</script>

<template>
  <section>
    <h1 class="text-primary text-4xl font-bold leading-tight tracking-[-0.02em]">Hello World</h1>
    <p class="mt-4 text-base font-normal text-gray-700 dark:text-gray-300">Count: {{ counter.count }}</p>
    <button
      class="mt-4 rounded bg-primary px-4 py-2 text-sm font-medium text-white"
      @click="counter.increment"
    >
      Increment
    </button>
  </section>
</template>
