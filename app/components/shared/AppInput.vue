<template>
  <div class="w-full space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
      {{ label }}
    </label>

    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900 dark:text-gray-100"
      :class="error ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    >

    <p v-if="error" class="text-xs text-red-600 dark:text-red-300">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    id?: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
  }>(),
  {
    id: undefined,
    label: "",
    type: "text",
    placeholder: "",
    required: false,
    disabled: false,
    error: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [];
}>();
</script>
