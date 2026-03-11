<script setup lang="ts">
const isMobileMenuOpen = ref(false);
const theme = useThemeStore();

const themeIcon = computed(() => (theme.isDark ? "lucide:moon" : "lucide:sun"));

const toggleTheme = () => {
  theme.toggleDarkMode();
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="text-xl font-bold tracking-[-0.02em] text-black dark:text-white">
        capera<span class="text-primary">FX</span>
      </NuxtLink>

      <nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[15px] font-medium tracking-[0.01em] text-gray-700 dark:text-gray-300 md:flex">
        <NuxtLink to="/" class="transition-colors hover:text-black dark:hover:text-white">Home</NuxtLink>
        <NuxtLink to="/transactions" class="transition-colors hover:text-black dark:hover:text-white">Transactions</NuxtLink>
        <NuxtLink to="/rates" class="transition-colors hover:text-black dark:hover:text-white">Rates</NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle menu"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon :name="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="h-5 w-5" />
        </button>

        <button
          type="button"
          :aria-label="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 md:inline-flex"
          @click="toggleTheme"
        >
          <Icon :name="themeIcon" class="h-5 w-5" />
        </button>

        <div class="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200 md:inline-flex">
          U
        </div>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">
      <nav class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 text-base font-medium tracking-[0.01em] text-gray-700 dark:text-gray-300 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="transition-colors hover:text-black dark:hover:text-white" @click="closeMobileMenu">Home</NuxtLink>
        <NuxtLink to="/transactions" class="transition-colors hover:text-black dark:hover:text-white" @click="closeMobileMenu">Transactions</NuxtLink>
        <NuxtLink to="/rates" class="transition-colors hover:text-black dark:hover:text-white" @click="closeMobileMenu">Rates</NuxtLink>

        <div class="mt-2 flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            type="button"
            :aria-label="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="toggleTheme"
          >
            <Icon :name="themeIcon" class="h-5 w-5" />
          </button>

          <div class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            U
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
