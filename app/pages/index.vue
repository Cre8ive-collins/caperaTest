<script setup lang="ts">
const counter = useCounterStore();
</script>

<template>
  <section>
    <h1 class="text-primary text-3xl font-semibold">Hello World</h1>
    <p class="mt-3 text-gray-700">Count: {{ counter.count }}</p>
    <button
      class="mt-3 rounded bg-primary px-4 py-2 text-white"
      @click="counter.increment"
    >
      Increment
    </button>
  </section>
</template>
