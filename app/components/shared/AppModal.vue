

<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="props.title"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        @click="handleClose"
      />

      <div class="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ props.title }}</h3>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Close modal"
            @click="handleClose"
          >
            <Icon name="lucide:x" class="h-4 w-4" />
          </button>
        </div>

        <div class="mt-4 text-sm text-gray-700 dark:text-gray-200">
          <slot/>
        </div>
      </div>
    </div>
  </Teleport>
</template>


<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
  }>(),
  {
    title: "Modal",
  }
);

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit("close");
};
</script>