<template>
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const theme = useThemeStore();

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    theme.setDarkMode(true);
  } else if (savedTheme === "light") {
    theme.setDarkMode(false);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.setDarkMode(prefersDark);
  }

  document.documentElement.classList.toggle("dark", theme.isDark);
});

watch(
  () => theme.isDark,
  (isDark) => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }
);
</script>