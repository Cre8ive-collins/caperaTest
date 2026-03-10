

<template>
  <div ref="containerRef" class="relative w-full space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
      {{ label }}
    </label>

    <input
      :id="id"
      type="hidden"
      :value="selectedCurrency"
      :required="required"
    >

    <button
      type="button"
      class="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-options`"
      @click="toggleDropdown"
    >
      <span class="inline-flex items-center gap-2" :class="selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'">
        <img
          v-if="selectedOption && !failedLogos.has(selectedOption.code)"
          :src="selectedOption.logo"
          :alt="`${selectedOption.code} logo`"
          class="h-4 w-4 rounded-full object-cover"
          loading="lazy"
          @error="markLogoAsFailed(selectedOption.code)"
        >
        <span
          v-else-if="selectedOption"
          class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
        >
          {{ selectedOption.code.slice(0, 1) }}
        </span>
        {{ selectedOption ? `${selectedOption.code} - ${selectedOption.label}` : placeholder }}
      </span>
      <Icon :name="isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </button>

    <div
      v-if="isOpen"
      :id="`${id}-options`"
      role="listbox"
      class="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="max-h-72 overflow-y-auto p-1">
        <div>
          <p class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Fiat</p>
          <button
            v-for="option in groupedOptions.fiat"
            :key="option.code"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors"
            :class="selectedCurrency === option.code
              ? 'bg-primary/10 text-primary'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'"
            @click="selectCurrency(option.code)"
          >
            <span class="inline-flex items-center gap-2">
              <img
                v-if="!failedLogos.has(option.code)"
                :src="option.logo"
                :alt="`${option.code} logo`"
                class="h-4 w-4 rounded-full object-cover"
                loading="lazy"
                @error="markLogoAsFailed(option.code)"
              >
              <span
                v-else
                class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {{ option.code.slice(0, 1) }}
              </span>
              <span>{{ option.code }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ option.label }}</span>
            </span>
            <Icon v-if="selectedCurrency === option.code" name="lucide:check" class="h-4 w-4" />
          </button>
        </div>

        <div class="mt-2 border-t border-gray-100 pt-2 dark:border-gray-800">
          <p class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Stablecoins</p>
          <button
            v-for="option in groupedOptions.stable"
            :key="option.code"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors"
            :class="selectedCurrency === option.code
              ? 'bg-primary/10 text-primary'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'"
            @click="selectCurrency(option.code)"
          >
            <span class="inline-flex items-center gap-2">
              <img
                v-if="!failedLogos.has(option.code)"
                :src="option.logo"
                :alt="`${option.code} logo`"
                class="h-4 w-4 rounded-full object-cover"
                loading="lazy"
                @error="markLogoAsFailed(option.code)"
              >
              <span
                v-else
                class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {{ option.code.slice(0, 1) }}
              </span>
              <span>{{ option.code }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ option.label }}</span>
            </span>
            <Icon v-if="selectedCurrency === option.code" name="lucide:check" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CurrencyOption } from "~/utils/currencies";
import { DEFAULT_CURRENCIES } from "~/utils/currencies";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    options?: CurrencyOption[];
  }>(),
  {
    modelValue: "",
    id: "currency",
    placeholder: "Select currency",
    disabled: false,
    required: false,
    options: () => DEFAULT_CURRENCIES,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const failedLogos = ref<Set<string>>(new Set());

const selectedCurrency = computed(() => props.modelValue);

const groupedOptions = computed(() => {
  const fiat = props.options.filter((option) => option.marketType === "fiat");
  const stable = props.options.filter((option) => option.marketType === "stable");

  return {
    fiat,
    stable,
  };
});

const selectedOption = computed(() =>
  props.options.find((option) => option.code === selectedCurrency.value)
);

const toggleDropdown = () => {
  if (props.disabled) {
    return;
  }

  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const markLogoAsFailed = (code: string) => {
  if (failedLogos.value.has(code)) {
    return;
  }

  failedLogos.value = new Set([...failedLogos.value, code]);
};

const selectCurrency = (code: string) => {
  emit("update:modelValue", code);
  closeDropdown();
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node | null;
  if (!target || !containerRef.value) {
    return;
  }

  if (!containerRef.value.contains(target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>