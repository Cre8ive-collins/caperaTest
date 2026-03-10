export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  function setDarkMode(value: boolean) {
    isDark.value = value;
  }

  function toggleDarkMode() {
    isDark.value = !isDark.value;
  }

  return { isDark, setDarkMode, toggleDarkMode };
});
