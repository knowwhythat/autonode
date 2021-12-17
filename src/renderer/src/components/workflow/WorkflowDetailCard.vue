<template>
  <div class="px-4 flex items-center">
    <el-popover trigger="click" placement="bottom" :width="280" title="工作流图标">
      <template #reference>
        <span
          title="Workflow icon"
          class="inline-block rounded-lg cursor-pointer mr-2 align-middle"
        >
          <i :class="workflow.icon ? workflow.icon : 'ri-global-line'" class="ri-2x" />
        </span>
      </template>
      <div class="grid grid-cols-4 gap-1">
        <i
          v-for="icon in icons"
          :class="icon"
          class="ri-2x cursor-pointer rounded-lg inline-block p-2 hoverable"
          :key="icon"
          @click="$emit('update', { icon })"
        />
      </div>
    </el-popover>
    <p
      class="font-semibold text-overflow inline-block text-lg flex-1 mr-4 align-middle"
    >{{ workflow.name }}</p>
  </div>
  <div class="flex px-2">
    <el-input v-model="state.query" placeholder="Search..." clearable :prefix-icon="Search" />
  </div>
  <hr class="m-2 border-gray-100" />
  <el-scrollbar>
    <template v-for="(items, catId) in taskList" :key="catId">
      <div class="flex items-center top-0 space-x-2 mb-2">
        <span :class="categories[catId].color" class="h-3 w-3 rounded-full"></span>
        <p class="capitalize">{{ categories[catId].label || categories[catId].name }}</p>
      </div>
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div
          v-for="block in items"
          :key="block.id"
          :title="block.description || block.name"
          draggable="true"
          class="select-none cursor-move relative p-4 rounded-lg bg-input transition"
          @dragstart="
            $event.dataTransfer.setData('block', JSON.stringify(block))
          "
        >
          <i :class="block.icon" class="ri-2x mb-2" />
          <p class="leading-tight text-overflow">{{ block.label || block.name }}</p>
        </div>
      </div>
    </template>
  </el-scrollbar>
</template>
<script setup>
import { shallowReactive, computed } from 'vue'
import { Search } from '@element-plus/icons'
import { tasks, categories } from '@/utils/shared';

const props = defineProps({
  workflow: {
    type: Object,
    default: () => ({}),
  }
});

const emit = defineEmits([
  'update',
]);

const state = shallowReactive({
  query: '',
});

const taskList = Object.keys(tasks).reduce((arr, key) => {
  const task = tasks[key];
  (arr[task.category] = arr[task.category] || []).push({ id: key, ...task });
  return arr;
}, {});

console.log(taskList)

const icons = [
  'ri-global-line',
  'ri-file-text-line',
  'ri-equalizer-line',
  'ri-timer-line',
  'ri-calendar-line',
  'ri-flashlight-line',
  'ri-lightbulb-flash-line',
  'ri-database-2-line',
  'ri-window-line',
  'ri-cursor-line',
  'ri-download-line',
  'ri-command-line',
];
</script>
<style scoped>
div :deep(.el-scrollbar__view) {
  @apply px-4 flex-1;
}
</style>