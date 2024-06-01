<template>
  <div
    class="min-h-full min-w-full absolute top-0 left-0 z-40 flex items-center justify-center"
  >
    <div
      class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full"
      :class="class"
    >
      <div class="p-4">
        <slot name="header" />
        <div class="mt-2">
          <slot name="body" />
        </div>
      </div>

      <div class="bg-gray-50 px-4 py-3 flex">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
defineEmits<{
  clickOutside: [];
}>();

defineProps<{ class?: string }>();
</script>
