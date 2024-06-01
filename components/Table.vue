<template>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index" class="border-t">
          <td
            class="p-2"
            v-for="header in headers"
            :key="`${index}-${header.key}`"
          >
            <slot :name="header.key" :row="row">{{ row[header.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { TableHeader } from "~/interfaces";

defineProps<{ headers: TableHeader[]; rows: Array<any> }>();
</script>
