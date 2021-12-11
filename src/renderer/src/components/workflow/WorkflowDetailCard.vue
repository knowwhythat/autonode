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
  <div class="flex px-4 mt-2 space-x-2">
    <el-button class="relative" type="primary" @click="$emit('save')">
      <span v-if="dataChanged" class="flex h-3 w-3 absolute top-0 left-0 -ml-1 -mt-1">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
      </span>
      <i class="ri-save-3-line" />保存
    </el-button>
    <el-button type="danger" @click="$emit('execute')">
      <i class="ri-play-line"></i>
    </el-button>
    <el-button type="info" @click="$emit('log')">
      <i class="ri-history-line"></i>
    </el-button>
    <el-dropdown @command="handleCommand">
      <el-button>
        <i class="ri-more-2-line"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="menu in menus" :key="menu.action" :command="menu.action">
            <i :class="menu.icon"></i>
            {{ menu.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <hr class="m-4 border-gray-100" />
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
import { tasks, categories } from '@/utils/shared';

const props = defineProps({
  workflow: {
    type: Object,
    default: () => ({}),
  },
  dataChanged: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'save',
  'log',
  'export',
  'update',
  'rename',
  'delete',
  'execute',
  'showSettings',
  'showDataColumns',
]);
function handleCommand(command) {
  emit(command, props.workflow);
}
const menus = [
  { name: '重命名', icon: 'ri-edit-box-line', action: 'rename' },
  { name: '导出', icon: 'ri-download-cloud-2-line', action: 'export' },
  { name: '数据', icon: 'ri-database-2-line', action: 'showDataColumns' },
  { name: '设置', icon: 'ri-settings-4-line', action: 'showSettings' },
  { name: '删除', icon: 'ri-delete-bin-5-line', action: 'delete' },
]

const taskList = Object.keys(tasks).reduce((arr, key) => {
  const task = tasks[key];
  (arr[task.category] = arr[task.category] || []).push({ id: key, ...task });
  return arr;
}, {});
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