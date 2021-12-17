<template>
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
</template>

<script setup>
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