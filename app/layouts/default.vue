<template>
  <div class="min-h-screen bg-white text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
    <AppHeader />
    <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 ">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">  
import AppHeader from "~/components/shared/AppHeader.vue";
</script>